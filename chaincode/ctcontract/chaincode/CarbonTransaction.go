package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type CTContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")

type CarbonTransaction struct {
	ID                  string   `json:"id"`
	IdPerusahaanPembeli string   `json:"idPerusahaanPembeli"`
	IdPerusahaanPenjual string   `json:"idPerusahaanPenjual"`
	Kuota               int   `json:"kuota"`
	Status              string   `json:"status"`
	Vote                []string `json:"vote"`
	URLBuktiTransaksi   string   `json:"urlBuktiTransaksi"`
}
type CarbonTransactionResult struct {
	ID                string      `json:"id"`
	PerusahaanPembeli *Perusahaan `json:"PerusahaanPembeli"`
	PerusahaanPenjual *Perusahaan `json:"PerusahaanPenjual"`
	Kuota             int      `json:"kuota"`
	Status            string      `json:"status"`
	Vote              []string    `json:"vote"`
	URLBuktiTransaksi string      `json:"urlBuktiTransaksi"`
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
func (s *CTContract) CreateCT(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 6 {

	}

	id := args[0]
	idPerusahaanPembeli := args[1]
	idPerusahaanPenjual := args[2]
	kuotaStr := args[3]
	vote := []string{}
	status := args[4]
	urlBuktiTransaksi := args[5]


	kuota, err := strconv.Atoi(kuotaStr)
	if err != nil {
	}
	
	exists, err := isCtExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	ct := CarbonTransaction{
		ID:                  id,
		IdPerusahaanPembeli: idPerusahaanPembeli,
		IdPerusahaanPenjual: idPerusahaanPenjual,
		Kuota:               kuota,
		Vote:                vote,
		URLBuktiTransaksi:   urlBuktiTransaksi,
		Status:              status,
	}

	ctJSON, err := json.Marshal(ct)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ctJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isCtExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	ctJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return ctJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*CarbonTransaction, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var ctList []*CarbonTransaction

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var ct CarbonTransaction
		err = json.Unmarshal(queryResult.Value, &ct)
		if err != nil {
		}
		ctList = append(ctList, &ct)
	}

	return ctList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *CTContract) ReadAllCT(ctx contractapi.TransactionContextInterface) ([]*CarbonTransaction, error) {
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

func (s *CTContract) GetCTById(ctx contractapi.TransactionContextInterface) (*CarbonTransactionResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	ct, err := getCTStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	ctResult, err := getCompleteDataCT(ctx, ct)
	if err != nil {
		return nil, err
	}

	return ctResult, nil
}
func getCompleteDataCT(ctx contractapi.TransactionContextInterface, ct *CarbonTransaction) (*CarbonTransactionResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var ctr CarbonTransactionResult

	ctr.ID = ct.ID
	ctr.Kuota = ct.Kuota
	ctr.Status = ct.Status
	ctr.URLBuktiTransaksi=ct.URLBuktiTransaksi
	ctr.PerusahaanPembeli = nil
	ctr.PerusahaanPenjual = nil
	ctr.Vote = []string{}

	return &ctr, nil
}
func getCTStateById(ctx contractapi.TransactionContextInterface, id string) (*CarbonTransaction, error) {

	ctJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if ctJSON == nil {
	}

	var ct CarbonTransaction
	err = json.Unmarshal(ctJSON, &ct)
	if err != nil {
	}

	return &ct, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *CTContract) UpdateCT(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 6 {
	}

	id := args[0]
	idPerusahaanPembeli := args[1]
	idPerusahaanPenjual := args[2]
	kuotaStr := args[3]
	status := args[4]
	urlBuktiTransaksi := args[5]

	ct, err := getCTStateById(ctx, id)
	if err != nil {
		return err
	}

	kuota, err := strconv.Atoi(kuotaStr)
	if err != nil {
	}

	ct.ID = id
	ct.IdPerusahaanPembeli = idPerusahaanPembeli
	ct.IdPerusahaanPenjual = idPerusahaanPenjual
	ct.Kuota = kuota
	ct.Status = status
	ct.URLBuktiTransaksi = urlBuktiTransaksi

	ctJSON, err := json.Marshal(ct)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ctJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *CTContract) DeleteCT(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isCtExists(ctx, id)
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
