package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type VEContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")

type Divisi struct {
	ID           string `json:"id"`
	Name 		 string `json:"name"`
	IdPerusahaan string `json:"perusahaan"`
	Lokasi       string `json:"lokasi"`
	IdManajer    string `json:"manajer"`
}

type VehicleResult struct {
	ID       string  `json:"id"`
	IdDivisi *Divisi `json:"divisi"`
	CarModel string  `json:"carModel"`
	FuelType string  `json:"fuelType"`
	KmUsage  string  `json:"kmUsage"`
}

type Vehicle struct {
	ID       string `json:"id"`
	IdDivisi string `json:"divisi"`
	CarModel string `json:"carModel"`
	FuelType string `json:"fuelType"`
	KmUsage  string `json:"kmUsage"`
}
const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-Ijazah with id '%s' already exists."
	ER13        = "ER13-Ijazah with id '%s' doesn't exist."
	ER14        = "ER14-Ijazah with id '%s' no longer require approval."
	ER15        = "ER15-Ijazah with id '%s' already approved by PTK with id '%s'."
	ER16        = "ER16-Ijazah with id '%s' cannot be approved by PTK with id '%s' in this step."
	ER31        = "ER31-Failed to change to world state: %v."
	ER32        = "ER32-Failed to read from world state: %v."
	ER33        = "ER33-Failed to get result from iterator: %v."
	ER34        = "ER34-Failed unmarshaling JSON: %v."
	ER35        = "ER35-Failed parsing string to integer: %v."
	ER36        = "ER36-Failed parsing string to float: %v."
	ER37        = "ER37-Failed to query another chaincode (%s): %v."
	ER41        = "ER41-Access is not permitted with MSDPID '%s'."
	ER42        = "ER42-Unknown MSPID: '%s'."
)
// Create Vehicle
// 1. Manajer Create Vehicle

// CreateAsset issues a new asset to the world state with given details.
func (s *VEContract) CreateVehicle(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 5 {

	}

	id := args[0]
	idDivisi := args[1]
	carModel := args[2]
	fuelType := args[3]
	kmUsage := args[4]

	exists, err := isVeExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}
	

	vhc := Vehicle{
		ID:       id,
		IdDivisi: idDivisi,
		CarModel: carModel,
		FuelType: fuelType,
		KmUsage:  kmUsage,
	}

	vhcJSON, err := json.Marshal(vhc)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, vhcJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isVeExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	vhcJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return vhcJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Vehicle, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var vehicleList []*Vehicle

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var vehicle Vehicle
		err = json.Unmarshal(queryResult.Value, &vehicle)
		if err != nil {
		}
		vehicleList = append(vehicleList, &vehicle)
	}

	return vehicleList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *VEContract) ReadAllVehicle(ctx contractapi.TransactionContextInterface) ([]*Vehicle, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 0 {

	}

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// GetVehiclesByDivisi retrieves all vehicles belonging to a specific division (idDivisi)
func (s *VEContract) GetVehiclesByDivisi(ctx contractapi.TransactionContextInterface, idDivisi string) ([]*Vehicle, error) {
    queryString := fmt.Sprintf(`{"selector":{"divisi":"%s"}}`, idDivisi)

    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return nil, fmt.Errorf("failed to execute query: %v", err)
    }
    defer resultsIterator.Close()

    return constructQueryResponseFromIterator(resultsIterator)
}


func (s *VEContract) GetVehicleById(ctx contractapi.TransactionContextInterface) (*VehicleResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	vehicle, err := getVehicleStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	perusahaanResult, err := getCompleteDataVehicle(ctx, vehicle)
	if err != nil {
		return nil, err
	}

	return perusahaanResult, nil
}
func getCompleteDataVehicle(ctx contractapi.TransactionContextInterface, vehicle *Vehicle) (*VehicleResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var vehicleResult VehicleResult
 
	vehicleResult.ID = vehicle.ID
	vehicleResult.CarModel = vehicle.CarModel
	vehicleResult.FuelType = vehicle.FuelType
	vehicleResult.KmUsage = vehicle.KmUsage

	div, err := getDivById(ctx, vehicle.IdDivisi)
	if err!=nil {
		return nil, err
	}

	vehicleResult.IdDivisi = div

	// response := ctx.GetStub().InvokeChaincode(PDContract, queryArgs, AcademicChannel)

	return &vehicleResult, nil
}

func getDivById(ctx contractapi.TransactionContextInterface, idDivisi string) (*Divisi, error) {
	// logger.Infof("Run getSpById function with idSp: '%s'.", idSp)

	params := []string{"GetDivisiById", idDivisi}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode("divcontract", queryArgs, "carbonchannel")
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, "divcontract", response.Message)
	}

	var div Divisi
	err := json.Unmarshal([]byte(response.Payload), &div)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &div, nil
}

func getVehicleStateById(ctx contractapi.TransactionContextInterface, id string) (*Vehicle, error) {

	vehicleJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if vehicleJSON == nil {
	}

	var vehicle Vehicle
	err = json.Unmarshal(vehicleJSON, &vehicle)
	if err != nil {
	}

	return &vehicle, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *VEContract) UpdateVehicle(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 4 {
	}

	id := args[0]
	carModel := args[1]
	fuelType := args[2]
	kmUsage := args[3]

	vehicle, err := getVehicleStateById(ctx, id)
	if err != nil {
		return err
	}

	vehicle.ID = id
	vehicle.CarModel = carModel
	vehicle.FuelType = fuelType
	vehicle.KmUsage = kmUsage
	vehicle.IdDivisi = ""
	
	vehicleJSON, err := json.Marshal(vehicle)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, vehicleJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *VEContract) DeleteVehicle(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isVeExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
	}

	err = ctx.GetStub().DelState(id)
	if err != nil {
	}

	return err
}

// func (s *VEContract) SeedDb(ctx contractapi.TransactionContextInterface) error {
// 	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	
// 	string idDivisi := "9f5c4a2b-3e4d-6b8b-9a0a-1e8f9e6f5d0a"
// 	for i:=1; i < 100000; i++ {
// 		vhc := Vehicle{
// 			ID:       uuid.New(),
// 			IdDivisi: idDivisi,
// 			CarModel: RandString(10),
// 			FuelType: RandString(10),
// 			KmUsage:  0,
// 		}

// 		vhcJSON, err := json.Marshal(vhc)
// 		if err != nil {
// 			return err
// 		}

// 		err = ctx.GetStub().PutState(id, vhcJSON)
// 		if err != nil {
// 			fmt.Errorf(err.Error())
// 		}

// 	}
// }
// func RandString(n int) string {
//     b := make([]byte, n)
//     for i := range b {
//         b[i] = letterBytes[rand.Intn(len(letterBytes))]
//     }
//     return string(b)
// }
