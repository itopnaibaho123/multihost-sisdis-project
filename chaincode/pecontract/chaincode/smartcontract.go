package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"
	"math/rand"
	"github.com/google/uuid"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type PEContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")

type UpdateSupplyChain struct {
	IdPerusahaan string `json:"idPerusahaan"`
	IdSupplyChain string `json:"idSupplyChain`
}

type SupplyChain struct {
	ID                  string                `json:"id"`
	ListPerusahaan      []string              `json:"listPerusahaan"`
	Status              int                   `json:"status"`
	ProposalSupplyChain []ProposalSupplyChain `json: "proposalSupplyChain"`
}

type ProposalSupplyChain struct {
	IdPerusahaan string `json:"id"`
	Status       string `json:"status"`
}

type EmisiKarbon struct {
	ID           string `json:"id"`
	IdPerusahaan string `json:"idPerusahaan"`
	IdProposal   string `json:"idProposal"`
	TotalEmisi   int    `json:"totalEmisi"`
}

type PerusahaanResult struct {
	ID                  string                 `json:"id"`
	NomorTelepon        string                 `json:"nomorTelepon"`
	Email               string                 `json:"email"`
	Nama                string                 `json:"nama"`
	Lokasi              string                 `json:"lokasi"`
	Deskripsi           string                 `json:"deskripsi"`
	URLSuratProposal    string                 `json:"urlSuratProposal"`
	ApprovalStatus      int                    `json:"approvalStatus"`
	ParticipantStatus   int                    `json:"participantStatus"`
	SupplyChain         []*SupplyChain         `json:"supplyChain"`
	ProposalSupplyChain []*ProposalSupplyChain `json:"proposalSupplyChain"`
	EmisiKarbon         *EmisiKarbon           `json:"emisiKarbon"`
	AdminPerusahaan     *Admin                 `json:"adminPerusahaan"`
	Kuota               int                    `json:"kuota"`
	SisaKuota           int                    `json:"sisaKuota"`
}

// ganti manajer menjadi admin perusahaan
// tambahin list Divisi

// Create Perusahaan
// 1. Calon Admin Perusahaan Mengisi Form detail perusahaan dan email perusahaan (email admin)
// 2. Akan masuk ke dashboard staf kementerian,
// 3. Kalo di Approve, Hit API regiter admin Perusahaan dan hit api create perusahaan

// * Initial Pembuatan perusahaan, lansung membuat OBject EmisiKarbon Hit Create EMission Carbon API
type Admin struct {
	ID             	string 	`json:"id"`
	Username 		string 	`json:"username"`
}
type UpdateSisaKuota struct{
	PerusahaanPembeli     string               `json:"perusahaanPembeli"`
	PerusahaanPenjual     string               `json:"perusahaanPenjual"`
	Kuota           	  int                  `json:"kuota"`
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
	AdminPerusahaan     *Admin   `json:"adminPerusahaan"`
	Kuota               int      `json:"kuota"`
	SisaKuota           int      `json:"sisaKuota"`
}

// CreateAsset issues a new asset to the world state with given details.
func (s *PEContract) CreatePerusahaan(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 9 {

	}

	id := args[0]
	NomorTelepon := args[1]
	Email := args[2]
	Nama := args[3]
	Lokasi := args[4]
	Deskripsi := args[5]
	URLSuratProposal := args[6]
	adminPerusahaan := &Admin{
		ID:           args[7],
        Username:     args[8],
	}
	ApprovalStatus := 0
	ParticipantStatus := 0
	SupplyChain := []string{}
	ProposalSupplyChain := []string{}
	EmisiKarbon := ""
	Kuota := 0
	SisaKuota := 0

	exists, err := isPeExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	pe := Perusahaan{
		ID:                  id,
		NomorTelepon:        NomorTelepon,
		Email:               Email,
		Nama:                Nama,
		Lokasi:              Lokasi,
		Deskripsi:           Deskripsi,
		URLSuratProposal:    URLSuratProposal,
		ApprovalStatus:      ApprovalStatus,
		ParticipantStatus:   ParticipantStatus,
		IdEmisiKarbon:       EmisiKarbon,
		AdminPerusahaan:     adminPerusahaan,
		Kuota:               Kuota,
		SisaKuota:           SisaKuota,
		SupplyChain:         SupplyChain,
		ProposalSupplyChain: ProposalSupplyChain,
	}

	peJSON, err := json.Marshal(pe)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, peJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isPeExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	klsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return klsJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Perusahaan, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var peruhasaanList []*Perusahaan

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var perusahaan Perusahaan
		err = json.Unmarshal(queryResult.Value, &perusahaan)
		if err != nil {
		}
		peruhasaanList = append(peruhasaanList, &perusahaan)
	}

	return peruhasaanList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *PEContract) ReadAllPerusahaan(ctx contractapi.TransactionContextInterface) ([]*Perusahaan, error) {
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

func (s *PEContract) ReadAllPendingPerusahaan(ctx contractapi.TransactionContextInterface) ([]*Perusahaan, error) {
    resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
    if err != nil {
        return nil, fmt.Errorf("error retrieving Perusahaan: %v", err)
    }
    defer resultsIterator.Close()

    var pendingPerusahaan []*Perusahaan

    for resultsIterator.HasNext() {
        queryResult, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("error iterating over Perusahaan: %v", err)
        }

        var perusahaan Perusahaan
        err = json.Unmarshal(queryResult.Value, &perusahaan)
        if err != nil {
            return nil, fmt.Errorf("error unmarshalling Perusahaan JSON: %v", err)
        }

        if perusahaan.ApprovalStatus == 0 {
            pendingPerusahaan = append(pendingPerusahaan, &perusahaan)
        }
    }

    return pendingPerusahaan, nil
}

func (s *PEContract) GetPerusahaanById(ctx contractapi.TransactionContextInterface) (*Perusahaan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	perusahaan, err := getPerusahaanStateById(ctx, id)
	if err != nil {
		return nil, err
	}

	return perusahaan, nil
}

// ApprovePerusahaan updates the status field of a Perusahaan entity on the ledger.
func (s *PEContract) ApprovePerusahaan(ctx contractapi.TransactionContextInterface, id string) error {
	// Retrieve the existing Perusahaan entity from the ledger
	perusahaan, err := getPerusahaanStateById(ctx, id)
	if err != nil {
		return err
	}

	// Update the status field
	perusahaan.ApprovalStatus = 1

	// Marshal the updated Perusahaan struct to JSON
	perusahaanJSON, err := json.Marshal(perusahaan)
	if err != nil {
		return err
	}

	// Put the updated Perusahaan JSON back to the ledger
	err = ctx.GetStub().PutState(id, perusahaanJSON)
	if err != nil {
		return err
	}

	return nil
}
// ApprovePerusahaan updates the status field of a Perusahaan entity on the ledger.
func (s *PEContract) RejectPerusahaan(ctx contractapi.TransactionContextInterface, id string) error {
	// Retrieve the existing Perusahaan entity from the ledger
	perusahaan, err := getPerusahaanStateById(ctx, id)
	if err != nil {
		return err
	}

	// Update the status field
	perusahaan.ApprovalStatus = -1

	// Marshal the updated Perusahaan struct to JSON
	perusahaanJSON, err := json.Marshal(perusahaan)
	if err != nil {
		return err
	}

	// Put the updated Perusahaan JSON back to the ledger
	err = ctx.GetStub().PutState(id, perusahaanJSON)
	if err != nil {
		return err
	}

	return nil
}

func (s *PEContract) AddSupplyChaintoArray(ctx contractapi.TransactionContextInterface, jsonData string) error {
	// Retrieve the existing Perusahaan entity from the ledger

	var us UpdateSupplyChain
	err := json.Unmarshal([]byte(jsonData), &us)
	if err != nil {
		return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
	
	
	perusahaan, err := getPerusahaanStateById(ctx, us.IdPerusahaan)
	if err != nil {
		return err
	}


	for _, search := range perusahaan.SupplyChain {
		if(search == us.IdSupplyChain) {
			return nil
		}
	}

	// Update the status field
	perusahaan.SupplyChain = append(perusahaan.SupplyChain, us.IdSupplyChain)

	// Marshal the updated Perusahaan struct to JSON
	perusahaanJSON, err := json.Marshal(perusahaan)
	if err != nil {
		return err
	}

	// Put the updated Perusahaan JSON back to the ledger
	err = ctx.GetStub().PutState(us.IdPerusahaan, perusahaanJSON)
	if err != nil {
		return err
	}

	return nil
}

func remove(s []string, r string) []string {
	for i, v := range s {
		if v == r {
			return append(s[:i], s[i+1:]...)
		}
	}
	return s
}

func (s *PEContract) DeleteSupplyChainfromArray(ctx contractapi.TransactionContextInterface, jsonData string) error {
	// Retrieve the existing Perusahaan entity from the ledger
	var us UpdateSupplyChain
	err := json.Unmarshal([]byte(jsonData), &us)
	if err != nil {
		return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
	
	perusahaan, err := getPerusahaanStateById(ctx, us.IdPerusahaan)
	if err != nil {
		return err
	}

	// Update the status field
	// perusahaan.SupplyChain = append(perusahaan.SupplyChain, args[1])
	perusahaan.SupplyChain = remove(perusahaan.SupplyChain, us.IdSupplyChain)

	// Marshal the updated Perusahaan struct to JSON
	perusahaanJSON, err := json.Marshal(perusahaan)
	if err != nil {
		return err
	}

	// Put the updated Perusahaan JSON back to the ledger
	err = ctx.GetStub().PutState(us.IdPerusahaan, perusahaanJSON)
	if err != nil {
		return err
	}

	return nil
}

func (s *PEContract) RemoveSupplyChaintoArray(ctx contractapi.TransactionContextInterface) error {
	// Retrieve the existing Perusahaan entity from the ledger

	args := ctx.GetStub().GetStringArgs()[1:]
	perusahaan, err := getPerusahaanStateById(ctx, args[0])
	if err != nil {
		return err
	}

	// Update the status field
	for i, str := range perusahaan.SupplyChain {
		if str == args[1] {
			perusahaan.SupplyChain = append(perusahaan.SupplyChain[:i], perusahaan.SupplyChain[i+1:]...)
		}
	}

	// Marshal the updated Perusahaan struct to JSON
	perusahaanJSON, err := json.Marshal(perusahaan)
	if err != nil {
		return err
	}

	// Put the updated Perusahaan JSON back to the ledger
	err = ctx.GetStub().PutState(args[0], perusahaanJSON)
	if err != nil {
		return err
	}

	return nil
}

func getCompleteDataPerusahaan(ctx contractapi.TransactionContextInterface, perusahaan *Perusahaan) (*PerusahaanResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var perusahaanResult PerusahaanResult

	perusahaanResult.ID = perusahaan.ID
	perusahaanResult.NomorTelepon = perusahaan.NomorTelepon
	perusahaanResult.Email = perusahaan.Email
	perusahaanResult.Nama = perusahaan.Nama
	perusahaanResult.Lokasi = perusahaan.Lokasi
	perusahaanResult.Deskripsi = perusahaan.Deskripsi
	perusahaanResult.URLSuratProposal = perusahaan.URLSuratProposal
	perusahaanResult.ApprovalStatus = perusahaan.ApprovalStatus
	perusahaanResult.AdminPerusahaan = perusahaan.AdminPerusahaan
	perusahaanResult.ParticipantStatus = perusahaan.ParticipantStatus
	perusahaanResult.Kuota = perusahaan.Kuota
	perusahaanResult.SisaKuota = perusahaan.SisaKuota
	perusahaanResult.ProposalSupplyChain = []*ProposalSupplyChain{}
	perusahaanResult.SupplyChain = []*SupplyChain{}

	return &perusahaanResult, nil
}
func getPerusahaanStateById(ctx contractapi.TransactionContextInterface, id string) (*Perusahaan, error) {

	perusahaanJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return &Perusahaan{}, fmt.Errorf("Failed to Get Perusahaan with ERror: %v", err)
	}
	if perusahaanJSON == nil {
	}

	var perusahaan Perusahaan
	err = json.Unmarshal(perusahaanJSON, &perusahaan)
	if err != nil {
	}

	return &perusahaan, nil
}
func (s *PEContract) UpdateSisaKuota(ctx contractapi.TransactionContextInterface, jsondata string) error {
	
	var usk UpdateSisaKuota
	err := json.Unmarshal([]byte(jsondata), &usk)
   
	if err != nil {
	 return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
	perusahaanPembeli, err := getPerusahaanStateById(ctx, usk.PerusahaanPembeli)
	if err != nil {
		return fmt.Errorf("Failed to Get Perusahaan: %v", err)
	}

	perusahaanPenjual, err := getPerusahaanStateById(ctx,usk.PerusahaanPenjual)
	if err != nil {
		return fmt.Errorf("Failed to Get Perusahaan with ERror: %v", err)
	}
	
	perusahaanPembeli.SisaKuota += usk.Kuota
	perusahaanPenjual.SisaKuota -= usk.Kuota
	perusahaanPembeliJSON, err := json.Marshal(perusahaanPembeli)
	if err != nil {
		return err
	}
	perusahaanPenjualJSON, err := json.Marshal(perusahaanPenjual)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(perusahaanPembeli.ID, perusahaanPembeliJSON)
	if err != nil {
	}

	err = ctx.GetStub().PutState(perusahaanPenjual.ID, perusahaanPenjualJSON)
	if err != nil {
	}

	return err

}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *PEContract) UpdatePerusahaan(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 11 {
	}

	id := args[0]
	nomorTelepon := args[1]
	email := args[2]
	nama := args[3]
	lokasi := args[4]
	deskripsi := args[5]
	urlSuratProposal := args[6]
	approvalStatusStr := args[7]
	participantStatusStr := args[8]
	KuotaStr := args[9]
	SisaKuotaStr := args[10]

	perusahaan, err := getPerusahaanStateById(ctx, id)
	if err != nil {
		return err
	}

	kuota, err := strconv.Atoi(KuotaStr)
	if err != nil {
	}
	sisaKuota, err := strconv.Atoi(SisaKuotaStr)
	if err != nil {
	}

	approvalStatus, err := strconv.Atoi(approvalStatusStr)
	if err != nil {
	}

	participantStatus, err := strconv.Atoi(participantStatusStr)
	if err != nil {
	}

	perusahaan.NomorTelepon = nomorTelepon
	perusahaan.Email = email
	perusahaan.Nama = nama
	perusahaan.Lokasi = lokasi
	perusahaan.Deskripsi = deskripsi
	perusahaan.URLSuratProposal = urlSuratProposal
	perusahaan.ApprovalStatus = approvalStatus
	perusahaan.ParticipantStatus = participantStatus
	perusahaan.Kuota = kuota
	perusahaan.SisaKuota = sisaKuota

	perusahaanJSON, err := json.Marshal(perusahaan)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, perusahaanJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *PEContract) DeletePerusahaan(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isPeExists(ctx, id)
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


func (s *PEContract) SeedDb(ctx contractapi.TransactionContextInterface) error {
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	
	string idPerusahaan := "7f5c4a2b-3e4d-4b8b-9a0a-1e8f9e6f5d0a"
	string idSupplyChain := "8a3e8b6d-2g5d-6b8b-9f5c-2g8f9e6f5d0a"
	for i:=1; i < 100000; i++ {
		pe := Perusahaan{
			ID:                  idPerusahaan,
			NomorTelepon:        RandString(10),
			Email:               RandString(10),
			Nama:                RandString(10),
			Lokasi:              RandString(10),
			Deskripsi:           RandString(10),
			URLSuratProposal:    RandString(10),
			ApprovalStatus:      0,
			ParticipantStatus:   0,
			IdEmisiKarbon:       "",
			AdminPerusahaan:     &Admin{
				ID:           uuid.New(),
				Username:     RandString(10),
			},
			Kuota:               0,
			SisaKuota:           0,
			SupplyChain:         idSupplyChain,
			ProposalSupplyChain: "",
		}
		
		if(i==1) {
			pe.ID = idPerusahaan
		}

		peJSON, err := json.Marshal(pe)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(id, peJSON)
		if err != nil {
			fmt.Errorf(err.Error())
		}
	}
}
func RandString(n int) string {
    b := make([]byte, n)
    for i := range b {
        b[i] = letterBytes[rand.Intn(len(letterBytes))]
    }
    return string(b)
}
