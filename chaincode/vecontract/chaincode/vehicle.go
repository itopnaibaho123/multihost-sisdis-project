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
	vehicleResult.IdDivisi = nil

	return &vehicleResult, nil
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
