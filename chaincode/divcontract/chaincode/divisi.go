package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type DIVContract struct {
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

type DivisiResult struct {
	ID           string `json:"id"`
	Perusahaan 	*Perusahaan `json:"perusahaan"`
	Lokasi       string `json:"lokasi"`
	IdManajer    *Manajer `json:"manajer"`
}

type Manajer struct {
	ID             string   `json:"id"`
	IdPerusahaan   string   `json:"idPerusahaan"`
	Email          string   `json:"email"`
	Nama           string   `json:"nama"`
	NIK            string   `json:"nik"`
	IdDivisi       string   `json:"idDivisi"`
	ListPerjalanan []string `json:"listPerjalanan"`
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
func (s *DIVContract) CreateDivisi(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 5 {

	}

	id := args[0]
	idPerusahaan := args[1]
	lokasi := args[2]
	idManajer := args[3]

	exists, err := isDvsExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	dvs := Divisi{
		ID:           id,
		IdPerusahaan: idPerusahaan,
		Lokasi:       lokasi,
		IdManajer:    idManajer,
	}

	dvsJSON, err := json.Marshal(dvs)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, dvsJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isDvsExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	dvsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return dvsJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Divisi, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var divisiList []*Divisi

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var divisi Divisi
		err = json.Unmarshal(queryResult.Value, &divisi)
		if err != nil {
		}
		divisiList = append(divisiList, &divisi)
	}

	return divisiList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *DIVContract) ReadAllDivisi(ctx contractapi.TransactionContextInterface) ([]*Divisi, error) {
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

func (s *DIVContract) GetDivisiById(ctx contractapi.TransactionContextInterface) (*DivisiResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	vehicle, err := getDivisiStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	perusahaanResult, err := getCompleteDataDivisi(ctx, vehicle)
	if err != nil {
		return nil, err
	}

	return perusahaanResult, nil
}
func getCompleteDataDivisi(ctx contractapi.TransactionContextInterface, divisi *Divisi) (*DivisiResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var divisiResult DivisiResult

	divisiResult.ID = divisi.ID
	divisiResult.Lokasi = divisi.Lokasi
	divisiResult.IdManajer = nil
	divisiResult.Perusahaan = nil


	return &divisiResult, nil
}
func getDivisiStateById(ctx contractapi.TransactionContextInterface, id string) (*Divisi, error) {

	divisiJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if divisiJSON == nil {
	}

	var divisi Divisi
	err = json.Unmarshal(divisiJSON, &divisi)
	if err != nil {
	}

	return &divisi, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *DIVContract) UpdateDivisi(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 2 {
	}

	id := args[0]
	lokasi := args[1]
	divisi, err := getDivisiStateById(ctx, id)
	if err != nil {
		return err
	}

	divisi.ID = id
	divisi.Lokasi = lokasi

	divisiJSON, err := json.Marshal(divisi)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, divisiJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *DIVContract) DeleteDivisi(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isDvsExists(ctx, id)
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
