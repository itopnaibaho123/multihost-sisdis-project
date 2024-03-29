package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/common/flogging"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type UserContract struct {
	contractapi.Contract
}

// ============================================================================================================================
// Asset Definitions - The ledger will store User data
// ============================================================================================================================

type User struct {
	ID          	string   `json:"id"`
	Name   			string   `json:"name"`
	Email 	 		string   `json:"email"`
	Role 			string 	 `json:"role"`
	Organization 	string 	 `json:"organization"`
	
	ManagerPerusahaan   *ManagerPerusahaan 	`json:"data-manager"`
	AdminPerusahaan		*AdminPerusahaan 	`json:"data-admin"`
}

type ManagerPerusahaan struct {
	IdPerusahaan   string 	`json:"idPerusahaan"`
	IdDivisi 	   string 	`json:"idDivisi"`
	IdPerjalanan   []string `json:"idPerjalanan"`
	NIK 		   string 	`json:"nik"`
}

type AdminPerusahaan struct {
	IdPerusahaan   string `json:"idPerusahaan"`
}
// Create Manajer dibuat oleh AdminPerusahaan
// Admin Perusahana dibuat oleh Admin Kementrian melalui request
// ============================================================================================================================
// Error Messages
// ============================================================================================================================

const (
	ER11 		= "ER11-Incorrect number of arguments, required %d arguments, but you have %d arguments"
	ER12        = "ER12-User with id '%s' already exists"
	ER13        = "ER13-User with id '%s' doesn't exist"
	ER14		= "ER14-User with nik '%s' already exists"
	ER15		= "ER15-User with email '%s' doesn't exist"
	ER31        = "ER31-Failed to change to world state: %v"
	ER32        = "ER32-Failed to read from world state: %v"
	ER33        = "ER33-Failed to get result from iterator: %v"
	ER34        = "ER34-Failed unmarshaling JSON: %v"
	ER41        = "ER41-Access is not permitted with MSDPID '%s'"
	ER42        = "ER42-Unknown MSPID: '%s'"
)

// ============================================================================================================================
// Logger
// ============================================================================================================================

var logger = flogging.MustGetLogger("UserContract")

// RegisterUser issues a new asset to the world state with given details.
func (s *UserContract) RegisterUser(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 6 {
		logger.Errorf(ER11, 6, len(args))
		return fmt.Errorf(ER11, 6, len(args))
	}

	id := args[0]
	name := args[1]
	email := args[2]
	role := args[3]
	idPerusahaan := args[4]
	organization := args[5]

	exists, err := isUserExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(ER12, id)
	}

	user := User{
		ID:    id,
		Name:  name,
		Email: email,
		Role:  role,
		Organization: organization,
	}

	// Set ManagerPerusahaan or AdminPerusahaan based on role
	switch role {
	case "manager-perusahaan":
		managerPerusahaan := ManagerPerusahaan{
			IdPerusahaan: idPerusahaan, // Initialize with appropriate values
			IdDivisi:     "", // Initialize with appropriate values
			IdPerjalanan: make([]string, 0), // Initialize as empty slice
			NIK:          "", // Initialize with appropriate values
		}
		user.ManagerPerusahaan = &managerPerusahaan
	case "admin-perusahaan":
		user.AdminPerusahaan = &AdminPerusahaan{
			IdPerusahaan: idPerusahaan,
		}
	case "staf-kementerian", "admin-kementerian":
	default:
		return fmt.Errorf("unsupported role: %s", role)
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf(ER34, err.Error())
	}

	err = ctx.GetStub().PutState(id, userJSON)
	if err != nil {
		return fmt.Errorf(ER31, err.Error())
	}

	return nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *UserContract) ReadAllUser(ctx contractapi.TransactionContextInterface) ([]*User, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 0 {
		logger.Errorf(ER11, 0, len(args))
		return nil, fmt.Errorf(ER11, 0, len(args))
	}

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromUserIterator(resultsIterator)
}

func (s *UserContract) GetUserById(ctx contractapi.TransactionContextInterface) (*User, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetSmsById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}
	id := args[0]
	user, err := getUserStateById(ctx, id)
	if err != nil {
		return nil, err
	}

	return user, nil
}


// GetUserByUsername used by Login method
func (s *UserContract) GetUserByUsername(ctx contractapi.TransactionContextInterface) (*User, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetSmsById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}
	username := args[0]
	queryString := fmt.Sprintf(`{"selector":{"name":"%s"}}`, username)

	var user User
	queryResult, err := getQueryResultForQueryStringUser(ctx, queryString)
	if err != nil {
		return nil, err
	}

	user.ID = queryResult[0].ID
	user.Name = queryResult[0].Name
	user.Email = queryResult[0].Email
	user.Role = queryResult[0].Role
	user.ManagerPerusahaan = queryResult[0].ManagerPerusahaan
	user.AdminPerusahaan = queryResult[0].AdminPerusahaan

	return &user, nil
}

// UpdateUserData updates the general user data (excluding ManagerPerusahaan and AdminPerusahaan) for a user
func (s *UserContract) UpdateUserData(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	userId := args[0]
	name := args[1]
	email := args[2]
	
	// Retrieve the user from the ledger
	user, err := getUserStateById(ctx, userId)
	if err != nil {
		return err
	}

	// Update general user data
	user.Name = name
	user.Email = email

	// Marshal the updated user object
	updatedUserJSON, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf(ER34, err.Error())
	}

	// Update the user data in the ledger
	err = ctx.GetStub().PutState(userId, updatedUserJSON)
	if err != nil {
		return fmt.Errorf(ER31, err.Error())
	}

	return nil
}

// UpdateManagerData updates the manager data of a user
func (s *UserContract) UpdateManagerData(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	userId := args[0]
	idPerusahaan := args[1]
	idDivisi := args[2]
	nik := args[3]

	// Retrieve the user from the ledger
	user, err := getUserStateById(ctx, userId)
	if err != nil {
		return err
	}

	// Check if user is a manager
	if user.ManagerPerusahaan == nil {
		return fmt.Errorf("user with ID %s is not a manager", userId)
	}

	// Update field of ManagerPerusahaan
	user.ManagerPerusahaan.IdPerusahaan = idPerusahaan
	user.ManagerPerusahaan.IdDivisi = idDivisi
	user.ManagerPerusahaan.NIK = nik

	// Marshal the updated user object
	updatedUserJSON, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf(ER34, err.Error())
	}

	// Update the user data in the ledger
	err = ctx.GetStub().PutState(userId, updatedUserJSON)
	if err != nil {
		return fmt.Errorf(ER31, err.Error())
	}

	return nil
}

// AddManagerPerjalanan appends a new idPerjalanan value to the idPerjalanan field of ManagerPerusahaan for a user
func (s *UserContract) AddPerjalananToManager(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 2 {
		logger.Errorf(ER11, 2, len(args))
		return fmt.Errorf(ER11, 2, len(args))
	}

	userId := args[0]
	newPerjalananId := args[1]
	
	// Retrieve the user from the ledger
	user, err := getUserStateById(ctx, userId)
	if err != nil {
		return err
	}
	// Check if user is a manager
	if user.ManagerPerusahaan == nil {
		return fmt.Errorf("user with ID %s is not a manager", userId)
	}

	// Append newPerjalananId to idPerjalanan field
	user.ManagerPerusahaan.IdPerjalanan = append(user.ManagerPerusahaan.IdPerjalanan, newPerjalananId)

	// Marshal the updated user object
	updatedUserJSON, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf(ER34, err.Error())
	}

	// Update the user data in the ledger
	err = ctx.GetStub().PutState(userId, updatedUserJSON)
	if err != nil {
		return fmt.Errorf(ER31, err.Error())
	}

	return nil
}

// UpdateAdminData updates the admin data of a user
func (s *UserContract) UpdateAdminData(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 2 {
		logger.Errorf(ER11, 2, len(args))
		return fmt.Errorf(ER11, 2, len(args))
	}

	userId := args[0]
	idPerusahaan := args[1]

	// Retrieve the user from the ledger
	user, err := getUserStateById(ctx, userId)
	if err != nil {
		return err
	}

	// Check if user is a manager
	if user.AdminPerusahaan == nil {
		return fmt.Errorf("user with ID %s is not a manager", userId)
	}

	// Update field of ManagerPerusahaan
	user.AdminPerusahaan.IdPerusahaan = idPerusahaan

	// Marshal the updated user object
	updatedUserJSON, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf(ER34, err.Error())
	}

	// Update the user data in the ledger
	err = ctx.GetStub().PutState(userId, updatedUserJSON)
	if err != nil {
		return fmt.Errorf(ER31, err.Error())
	}

	return nil
}
// DeleteUser deletes an given asset from the world state.
func (s *UserContract) DeleteUser(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return fmt.Errorf(ER11, 1, len(args))
	}

	id := args[0]

	exists, err := isUserExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	err = ctx.GetStub().DelState(id)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}

func isUserExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	user, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return user != nil, nil
}

func getUserStateById(ctx contractapi.TransactionContextInterface, id string) (*User, error) {
	logger.Infof("Run getUserStateById function with id: '%s'.", id)

	userJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if userJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var user User
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &user, nil
}

func getQueryResultForQueryStringUser(ctx contractapi.TransactionContextInterface, queryString string) ([]*User, error) {
	logger.Infof("Run getQueryResultForQueryStringUser function with queryString: '%s'.", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromUserIterator(resultsIterator)
}

func constructQueryResponseFromUserIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*User, error) {
	logger.Infof("Run constructQueryResponseFromUserIterator function.")

	var listUser []*User

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf(ER33, err)
		}

		var user User
		err = json.Unmarshal(queryResult.Value, &user)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}
		listUser = append(listUser, &user)
	}

	return listUser, nil
}
