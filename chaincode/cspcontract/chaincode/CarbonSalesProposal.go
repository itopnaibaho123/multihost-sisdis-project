package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type CSPContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")



type CarbonSalesProposal struct {
	ID              string   `json:"id"`
	IdPerusahaan    string   `json:"idPerusahaan"`
	KuotaYangDijual string   `json:"kuotaYangDijual"`
	Status          string   `json:"status"`
}
type CarbonSalesProposalResult struct {
	ID              string   	  `json:"id"`
	IdPerusahaan    *Perusahaan   `json:"perusahaan"`
	KuotaYangDijual string  	  `json:"kuotaYangDijual"`
	Status          string   	  `json:"status"`
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
func (s *CSPContract) CreateProposal(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 4 {

	}

	id := args[0]
	idPerusahaan := args[1]
	kuotaYangDijual := args[2]
	status := args[3]
	

	exists, err := isCspExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf(id)
	}

	csp := CarbonSalesProposal{
		ID:                  id,
		IdPerusahaan:        idPerusahaan,
		KuotaYangDijual:     kuotaYangDijual,
		Status:              status,

	}

	cspJSON, err := json.Marshal(csp)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, cspJSON)
	if err != nil {
		fmt.Errorf(err.Error())
	}

	return err
}

func isCspExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	cspJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return cspJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*CarbonSalesProposal, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var cspList []*CarbonSalesProposal

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var csp CarbonSalesProposal
		err = json.Unmarshal(queryResult.Value, &csp)
		if err != nil {
		}
		cspList = append(cspList, &csp)
	}

	return cspList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *CSPContract) ReadAllCSP(ctx contractapi.TransactionContextInterface) ([]*CarbonSalesProposal, error) {
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

func (s *CSPContract) GetCSPById(ctx contractapi.TransactionContextInterface) (*CarbonSalesProposalResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	csp, err := getCSPStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	cspResult, err := getCompleteDataPerusahaan(ctx, csp)
	if err != nil {
		return nil, err
	}

	return cspResult, nil
}
func getCompleteDataPerusahaan(ctx contractapi.TransactionContextInterface, csp *CarbonSalesProposal) (*CarbonSalesProposalResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var cspr CarbonSalesProposalResult

	cspr.ID = csp.ID
	cspr.KuotaYangDijual = csp.KuotaYangDijual
	cspr.Status = csp.Status

	

	return &cspr, nil
}
func getCSPStateById(ctx contractapi.TransactionContextInterface, id string) (*CarbonSalesProposal, error) {

	cspJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if cspJSON == nil {
	}

	var csp CarbonSalesProposal
	err = json.Unmarshal(cspJSON, &csp)
	if err != nil {
	}

	return &csp, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *CSPContract) UpdateCSP(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 4 {
	}

	id := args[0]
	idPerusahaan := args[1]
	kuotaYangDijual := args[2]
	status := args[3]

	csp, err := getCSPStateById(ctx, id)
	if err != nil {
		return err
	}

	

	csp.ID = id
	csp.IdPerusahaan = idPerusahaan
	csp.KuotaYangDijual = kuotaYangDijual
	csp.Status = status
	

	cspJSON, err := json.Marshal(csp)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, cspJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *CSPContract) DeleteCSP(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isCspExists(ctx, id)
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
