package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"

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

type ProposalSupplyChain struct {
	ID            string   `json:"id"`
	IdPerusahaan  string   `json:"idPerusahaan"`
	Status        int      `json:"status"`
	IdSupplyChain string   `json:"idSupplyChain"`
	Vote          []string `json:"vote"`
}

type SupplyChain struct {
	ID             string   `json:"id"`
	ListPerusahaan []string `json:"listPerusahaan"`
	Status         int      `json:"status"`
	IdProposal     string   `json:"idProposal"`
}

type EmisiKarbon struct {
	ID           string `json:"id"`
	IdPerusahaan string `json:"idPerusahaan"`
	IdProposal   string `json:"idProposal"`
	TotalEmisi   int    `json:"totalEmisi"`
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
	Manajer             *Manajer               `json:"manajer"`
	Kuota               int                    `json:"kuota"`
	SisaKuota           int                    `json:"sisaKuota"`
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
func (s *PEContract) CreatePerusahaan(ctx contractapi.TransactionContextInterface) (*PerusahaanResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 7 {

	}

	id := args[0]
	NomorTelepon := args[1]
	Email := args[2]
	Nama := args[3]
	Lokasi := args[4]
	Deskripsi := args[5]
	URLSuratProposal := args[6]
	ApprovalStatus := 0
	ParticipantStatus := 0
	SupplyChain := []string{}
	ProposalSupplyChain := []string{}
	EmisiKarbon := ""
	Manajer := ""
	Kuota := 0
	SisaKuota := 0

	exists, err := isPeExists(ctx, id)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, fmt.Errorf(id)
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
		IdManajer:           Manajer,
		Kuota:               Kuota,
		SisaKuota:           SisaKuota,
		SupplyChain:         SupplyChain,
		ProposalSupplyChain: ProposalSupplyChain,
	}

	peJSON, err := json.Marshal(pe)
	if err != nil {
		return nil, err
	}

	err = ctx.GetStub().PutState(id, peJSON)
	if err != nil {
		return nil, err
	}

	perusahaan, _ := getPerusahaanStateById(ctx, id)
	perusahaanResult, err := getCompleteDataPerusahaan(ctx, perusahaan)
	if err != nil {
		return nil, err
	}

	return perusahaanResult, nil
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

func (s *PEContract) GetPerusahaanById(ctx contractapi.TransactionContextInterface) (*PerusahaanResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	perusahaan, err := getPerusahaanStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	perusahaanResult, err := getCompleteDataPerusahaan(ctx, perusahaan)
	if err != nil {
		return nil, err
	}

	return perusahaanResult, nil
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
	}
	if perusahaanJSON == nil {
	}

	var perusahaan Perusahaan
	err = json.Unmarshal(perusahaanJSON, &perusahaan)
	if err != nil {
	}

	return &perusahaan, nil
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

	id:= args[0]

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
