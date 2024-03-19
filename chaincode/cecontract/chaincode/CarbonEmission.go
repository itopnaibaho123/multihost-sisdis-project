package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type CEContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")

type CarbonEmission struct {
	ID           string   `json:"id"`
	IdPerusahaan string   `json:"perusahaan"`
	IdPerjalanan []string `json:"perjalanan"`
	TotalEmisi   string   `json:"totalEmisi"`
}

type CarbonEmissionResult struct {
	ID         	string      	`json:"id"`
	Perusahaan 	*Perusahaan 	`json:"perusahaan"`
	TotalEmisi   string      	`json:"totalEmisi"`
	Perjalanan  []* Perjalanan 	`json:"perjalanan"`
}

type Perjalanan struct {
	ID                  string   `json:"id"`
	IdSupplyChain       string   `json:"idSupplyChain"`
	IdDivisiPengirim    string   `json:"idDivisiPengirim"`
	IdDivisiPenerima    string   `json:"idDivisiPenerima"`
	Vote                []string `json:"vote"`
	Status              string   `json:"status"`
	WaktuBerangkat      string   `json:"waktuBerangkat"`
	WaktuSampai         string   `json:"waktuSampai"`
	IdTransportasi      string   `json:"idTransportasi"`
	BeratMuatan         string   `json:"beratMuatan"`
	EmisiKarbon         string   `json:"emisiKarbon"`
	IdEmisiKarbon	    string   `json:"idEmisiKarbon"`
}

type Perusahaan struct {
	ID                  string   `json:"id"`
	NomorTelepon        string   `json:"nomorTelepon"`
	Email               string   `json:"email"`
	Nama                string   `json:"nama"`
	Lokasi              string   `json:"lokasi"`
	Deskripsi           string   `json:"deskripsi"`
	URLSuratProposal    string   `json:"urlSuratProposal"`
	ApprovalStatus      int      `json:"approvalStatus"`
	ParticipantStatus   int      `json:"participantStatus"`
	SupplyChain         []string `json:"supplyChain"`
	ProposalSupplyChain []string `json:"proposalSupplyChain"`
	IdEmisiKarbon       string   `json:"emisiKarbon"`
	IdManajer           string   `json:"manajer"`
	Kuota               int      `json:"kuota"`
	SisaKuota           int      `json:"sisaKuota"`
}

// CreateAsset issues a new asset to the world state with given details.
func (s *CEContract) CreateCE(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 3 {

	}

	id := args[0]
	idPerusahaan := args[1]
	totalEmisi := args[2]
	IdPerjalanan := []string{}

	exists, err := isCeExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	ce := CarbonEmission{
		ID:           	id,
		IdPerusahaan: 	idPerusahaan,
		TotalEmisi:     totalEmisi,
		IdPerjalanan:   IdPerjalanan,
	}

	ceJSON, err := json.Marshal(ce)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ceJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isCeExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	ceJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return ceJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*CarbonEmission, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var carbonEmissionList []*CarbonEmission

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var carbonEmission CarbonEmission
		err = json.Unmarshal(queryResult.Value, &carbonEmission)
		if err != nil {
		}
		carbonEmissionList = append(carbonEmissionList, &carbonEmission)
	}

	return carbonEmissionList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *CEContract) ReadAllCE(ctx contractapi.TransactionContextInterface) ([]*CarbonEmission, error) {
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

func (s *CEContract) GetCEById(ctx contractapi.TransactionContextInterface) (*CarbonEmissionResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	vehicle, err := getCEStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	perusahaanResult, err := getCompleteDataCE(ctx, vehicle)
	if err != nil {
		return nil, err
	}

	return perusahaanResult, nil
}
func getCompleteDataCE(ctx contractapi.TransactionContextInterface, carbonEmission *CarbonEmission) (*CarbonEmissionResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var carbonEmissionResult CarbonEmissionResult

	carbonEmissionResult.ID = carbonEmission.ID
	carbonEmissionResult.TotalEmisi = carbonEmission.TotalEmisi

	return &carbonEmissionResult, nil
}
func getCEStateById(ctx contractapi.TransactionContextInterface, id string) (*CarbonEmission, error) {

	carbonEmissionJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if carbonEmissionJSON == nil {
	}

	var carbonEmission CarbonEmission
	err = json.Unmarshal(carbonEmissionJSON, &carbonEmission)
	if err != nil {
	}

	return &carbonEmission, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *CEContract) UpdateCE(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 2 {
	}

	id := args[0]
	totalEmisi := args[1]
	carbonEmission, err := getCEStateById(ctx, id)
	if err != nil {
		return err
	}

	carbonEmission.ID = id
	carbonEmission.TotalEmisi = totalEmisi

	carbonEmissionJSON, err := json.Marshal(carbonEmission)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, carbonEmissionJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *CEContract) DeleteCE(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isCeExists(ctx, id)
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
