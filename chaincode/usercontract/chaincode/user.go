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
	ID          string   `json:"id"`
	Name   		string   `json:"name"`
	Email 	 	string   `json:"email"`
	Password 	string   `json:"password"`
	Role 		string 	 `json:"role"`
}

type ManagerSC struct {
	ID             string 	`json:"id"`
	IdUser  	   string 	`json:"idUser"`
	IdPerusahaan   string 	`json:"idPerusahaan"`
	IdDivisi 	   string 	`json:"idDivisi"`
	IdPerjalanan   []string `json:"idPerjalanan"`
	NIK 		   string 	`json:"nik"`
}

type AdminSC struct {
	ID             string `json:"id"`
	IdUser         string `json:"idUser"`
	IdPerusahaan   string `json:"idPerusahaan"`
}

// ============================================================================================================================
// Error Messages
// ============================================================================================================================

const (
	ER11 		= "ER11-Incorrect number of arguments, required %d arguments, but you have %d arguments"
	ER12        = "ER12-User with id '%s' already exists"
	ER13        = "ER13-User with id '%s' doesn't exist"
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

// Register User issues a new asset to the world state with given details.
func (s *UserContract) RegisterUser(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 5 {
		logger.Errorf(ER11, 5, len(args))
		return fmt.Errorf(ER11, 5, len(args))
	}

	id := args[0]
	name := args[1]
	email := args[2]
	password := args[3]
	role := args[4]

	exists, err := isUserExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	user := User{
		ID: 		id,
		Name: 		name, 
		Email: 		email, 
		Password: 	password, 
		Role: 		role,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, userJSON)
	if err != nil {
		return fmt.Errorf(err.Error())
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
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*User, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

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

	return constructQueryResponseFromIterator(resultsIterator)
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


// ============================================================================================================================
// getSmsStateById - Get SMS state with given id.
// ============================================================================================================================

func getUserStateById(ctx contractapi.TransactionContextInterface, id string) (*User, error) {
	logger.Infof("Run getSmsStateById function with id: '%s'.", id)

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


// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *UserContract) UpdateUser(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdateUser function with args: %+q.", args)

	if len(args) != 5 {
		logger.Errorf(ER11, 5, len(args))
		return fmt.Errorf(ER11, 5, len(args))
	}

	id := args[0]
	name := args[1]
	email := args[2]
	password := args[3]
	role := args[4]

	exists, err := isUserExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	user, err := getUserStateById(ctx, id)
	if err != nil {
		return err
	}

	user.Name = name
	user.Email = email
	user.Password = password
	user.Role = role

	userJSON, err := json.Marshal(user)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, userJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
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
