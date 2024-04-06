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

// Proses Trading
// 1. Admin Perusahaan Isi Form Membuat CarbonSalesProposal Trading (Hit CC Create Carbon Sales Proposal)
// 2. Admin perusahaan lain mau membuat transaction dengan CarbonSalesProposal (Carbon Transaction Baru)
// 3. (Check) jumlah Kuota di Carbon Transaction  < Kuota di perusahaan (BOleh lanjut)
// 4. Kurangin jumlah carbon yang di CarbonSalesProposal dengan yang di Carbon Transaction
// 5. Kuota yang dibeli tidak boleh melebihi kuota di carbon sales proposal
// 6. Gagal Ditolak oleh Penjual
// 7. Berhasil diterima penjual
// 8. Pending belum digubris penjual
// 9. if URLBuktiTransaksi Null tidak bisa diapprove sama penjual

type CarbonTransaction struct {
	ID                  string `json:"id"`
	IdPerusahaanPembeli string `json:"idPerusahaanPembeli"`
	IdProposalPenjual   string `json:"idProposalPenjual"`
	Kuota               int    `json:"kuota"`
	Status              string `json:"status"`
	URLBuktiTransaksi   string `json:"urlBuktiTransaksi"`
}

// * Hapus Vote
// * Ganti IdPerusahaanPenjual dengan CarbonSalesProposal
type CarbonTransactionResult struct {
	ID                string               `json:"id"`
	PerusahaanPembeli *Perusahaan          `json:"perusahaanPembeli"`
	ProposalPenjual   *CarbonSalesProposal `json:"proposalPenjual"`
	Kuota             int                  `json:"kuota"`
	Status            string               `json:"status"`
	Vote              []string             `json:"vote"`
	URLBuktiTransaksi string               `json:"urlBuktiTransaksi"`
}

type CarbonSalesProposal struct {
	ID              string `json:"id"`
	IdPerusahaan    string `json:"idPerusahaan"`
	KuotaYangDijual int    `json:"kuotaYangDijual"`
	Status          string `json:"status"`
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
		IdProposalPenjual:   idPerusahaanPenjual,
		Kuota:               kuota,
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

func (s *CTContract) GetCTById(ctx contractapi.TransactionContextInterface) (*CarbonTransaction, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	ct, err := getCTStateById(ctx, id)
	if err != nil {
		return nil, err
	}


	return ct, nil
}
func getCompleteDataCT(ctx contractapi.TransactionContextInterface, ct *CarbonTransaction) (*CarbonTransactionResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var ctr CarbonTransactionResult

	ctr.ID = ct.ID
	ctr.Kuota = ct.Kuota
	ctr.Status = ct.Status
	ctr.URLBuktiTransaksi = ct.URLBuktiTransaksi
	ctr.PerusahaanPembeli = nil
	ctr.ProposalPenjual = nil
	ctr.Vote = []string{}

	return &ctr, nil
}



func (s *CTContract) GetCTbyIdPerusahaan(ctx contractapi.TransactionContextInterface) ([]*CarbonTransaction, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	idPerusahaan := args[0]

	queryString := fmt.Sprintf(`{"selector":{"idPerusahaanPembeli":"%s"}}`, idPerusahaan)
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}

	var ctList []*CarbonTransaction

	for _, ct := range queryResult {
		

		ctList = append(ctList, ct)
	}

	return ctList, nil
}

func (s *CTContract) GetCTbyIdProposal(ctx contractapi.TransactionContextInterface) ([]*CarbonTransaction, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	idProposal := args[0]

	queryString := fmt.Sprintf(`{"selector":{"idProposalPenjual":"%s"}}`, idProposal)
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}

	var ctList []*CarbonTransaction

	for _, ct := range queryResult {
		

		ctList = append(ctList, ct)
	}

	return ctList, nil
}
func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*CarbonTransaction, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("ER32", err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
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
func (s *CTContract) GetAllCTByStatus(ctx contractapi.TransactionContextInterface) ([]*CarbonTransaction, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"status":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var ctList []*CarbonTransaction


	for _, ct := range queryResult {
		ctList = append(ctList, ct)
	}
	
	return ctList, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *CTContract) UpdateCT(ctx contractapi.TransactionContextInterface , jsonData string) error {

	var ct CarbonTransaction
	err := json.Unmarshal([]byte(jsonData), &ct)
   
	if err != nil {
	 return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
   


	ctRes, err := getCTStateById(ctx, ct.ID)
	if err != nil {
		return err
	}

	ctRes.ID = ct.ID
	ctRes.IdPerusahaanPembeli = ct.IdPerusahaanPembeli
	ctRes.IdProposalPenjual = ct.IdProposalPenjual
	ctRes.Status = ct.Status
	ctRes.Kuota = ct.Kuota
	ctRes.URLBuktiTransaksi = ct.URLBuktiTransaksi

	ctJSON, err := json.Marshal(ctRes)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(ctRes.ID, ctJSON)
	if err != nil {
		return fmt.Errorf("Failed to Update CT: %v", err)
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
