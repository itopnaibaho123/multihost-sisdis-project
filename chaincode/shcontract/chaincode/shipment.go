package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SHContract struct {
	contractapi.Contract
}

type Perjalanan struct {
	ID               string   `json:"id"`
	IdSupplyChain    string   `json:"idSupplyChain"`
	IdDivisiPengirim string   `json:"idDivisiPengirim"`
	IdDivisiPenerima string   `json:"idDivisiPenerima"`
	Vote             []string `json:"vote"`
	Status           string   `json:"status"`
	WaktuBerangkat   string   `json:"waktuBerangkat"`
	WaktuSampai      string   `json:"waktuSampai"`
	IdTransportasi   string   `json:"idTransportasi"`
	BeratMuatan      int   `json:"beratMuatan"`
	EmisiKarbon      int   `json:"emisiKarbon"`
}

type PerjalananResult struct {
	ID             string          `json:"id"`
	IdSupplyChain  string          `json:"idSupplyChain"`
	DivisiPengirim *Divisi         `json:"divisiPengirim"`
	DivisiPenerima *Divisi         `json:"divisiPenerima"`
	Vote           []string        `json:"vote"`
	Status         string          `json:"status"`
	WaktuBerangkat string          `json:"waktuBerangkat"`
	WaktuSampai    string          `json:"waktuSampai"`
	Transportasi   *Vehicle        `json:"transportasi"`
	BeratMuatan    int        	   `json:"beratMuatan"`
	EmisiKarbon    int             `json:"emisiKarbonStr"`
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

type CarbonEmission struct {
	ID           string   `json:"id"`
	IdPerusahaan string   `json:"perusahaan"`
	IdPerjalanan []string `json:"perjalanan"`
	TotalEmisi   string   `json:"totalEmisi"`
}

type Vehicle struct {
	ID       string `json:"id"`
	IdDivisi string `json:"divisi"`
	CarModel string `json:"carModel"`
	FuelType string `json:"fuelType"`
	KmUsage  string `json:"kmUsage"`
}

// CreateAsset issues a new asset to the world state with given details.
func (s *SHContract) CreateShipment(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 11 {

	}

	id := args[0]
	idSupplyChain := args[1]
	divisiPengirim := args[2]
	divisiPenerima := args[3]
	vote := []string{}
	status := args[4]
	waktuBerangkat := args[5]
	waktuSampai := args[6]
	transportasi := args[7]
	beratMuatanstr := args[8]
	emisiKarbonstr := args[9]
	
	emisiKarbon, err := strconv.Atoi(emisiKarbonstr)
	if err != nil {
	}

	beratMuatan, err := strconv.Atoi(beratMuatanstr)
	if err != nil {
	}


	exists, err := isShipmentExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	perjalanan := Perjalanan{
		ID:               id,
		IdSupplyChain:    idSupplyChain,
		IdDivisiPengirim: divisiPengirim,
		IdDivisiPenerima: divisiPenerima,
		Vote:             vote,
		Status:           status,
		WaktuBerangkat:   waktuBerangkat,
		WaktuSampai:      waktuSampai,
		IdTransportasi:   transportasi,
		BeratMuatan:      beratMuatan,
		EmisiKarbon:      emisiKarbon,
	}

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, perjalananJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isShipmentExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	perjalananJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return perjalananJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Perjalanan, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var perjalananList []*Perjalanan

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var perjalanan Perjalanan
		err = json.Unmarshal(queryResult.Value, &perjalanan)
		if err != nil {
		}
		perjalananList = append(perjalananList, &perjalanan)
	}

	return perjalananList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *SHContract) ReadAllShipment(ctx contractapi.TransactionContextInterface) ([]*Perjalanan, error) {
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

func (s *SHContract) GetShipmentById(ctx contractapi.TransactionContextInterface) (*PerjalananResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	perjalanan, err := getShipmentStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	PerjalananResult, err := getCompleteDataShipment(ctx, perjalanan)
	if err != nil {
		return nil, err
	}

	return PerjalananResult, nil
}
func getCompleteDataShipment(ctx contractapi.TransactionContextInterface, perjalanan *Perjalanan) (*PerjalananResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var PerjalananResult PerjalananResult

	PerjalananResult.ID = perjalanan.ID
	PerjalananResult.IdSupplyChain = perjalanan.IdSupplyChain
	PerjalananResult.Status = perjalanan.Status
	PerjalananResult.WaktuBerangkat = perjalanan.WaktuBerangkat
	PerjalananResult.WaktuSampai = perjalanan.WaktuSampai
	PerjalananResult.BeratMuatan = perjalanan.BeratMuatan
	PerjalananResult.EmisiKarbon = perjalanan.EmisiKarbon
	PerjalananResult.DivisiPenerima = nil
	PerjalananResult.DivisiPengirim = nil
	PerjalananResult.Transportasi = nil
	PerjalananResult.Vote = []string{}

	return &PerjalananResult, nil
}
func getShipmentStateById(ctx contractapi.TransactionContextInterface, id string) (*Perjalanan, error) {

	perjalananJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if perjalananJSON == nil {
	}

	var perjalanan Perjalanan
	err = json.Unmarshal(perjalananJSON, &perjalanan)
	if err != nil {
	}

	return &perjalanan, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *SHContract) UpdateShipment(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 11 {
	}

	id := args[0]
	idSupplyChain := args[1]
	divisiPengirim := args[2]
	divisiPenerima := args[3]
	status := args[4]
	waktuBerangkat := args[5]
	waktuSampai := args[6]
	transportasi := args[7]
	beratMuatanstr := args[8]
	emisiKarbonstr := args[9]


	perjalanan, err := getShipmentStateById(ctx, id)
	if err != nil {
		return err
	}

	emisiKarbon, err := strconv.Atoi(emisiKarbonstr)
	if err != nil {
	}

	beratMuatan, err := strconv.Atoi(beratMuatanstr)
	if err != nil {
	}

	perjalanan.IdSupplyChain = idSupplyChain
	perjalanan.IdDivisiPenerima = divisiPengirim
	perjalanan.IdDivisiPenerima = divisiPenerima
	perjalanan.Status = status
	perjalanan.WaktuBerangkat = waktuBerangkat
	perjalanan.WaktuSampai = waktuSampai
	perjalanan.IdTransportasi = transportasi
	perjalanan.BeratMuatan = beratMuatan
	perjalanan.EmisiKarbon = emisiKarbon

	perjalananJSON, err := json.Marshal(perjalanan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, perjalananJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *SHContract) DeleteShipment(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isShipmentExists(ctx, id)
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
