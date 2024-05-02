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
	ID              string `json:"id"`
	IdPerusahaan    string `json:"idPerusahaan"`
	KuotaYangDijual int    `json:"kuotaYangDijual"`
	Status          string `json:"status"`
}
type CarbonSalesProposalResult struct {
	ID              string      `json:"id"`
	IdPerusahaan    *Perusahaan `json:"perusahaan"`
	KuotaYangDijual int         `json:"kuotaYangDijual"`
	Status          string      `json:"status"`
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

// CreateAsset issues a new asset to the world state with given details.
func (s *CSPContract) CreateProposal(ctx contractapi.TransactionContextInterface, jsonData string) error {
	var csp CarbonSalesProposal
	err:=json.Unmarshal([]byte(jsonData), &csp)
	if err != nil {
		return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
	cspJSON, err := json.Marshal(csp)
	if err != nil {
	 return err
	}
   
	err = ctx.GetStub().PutState(csp.ID, cspJSON)
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

func (s *CSPContract) GetAllCSPByIdPerusahaan(ctx contractapi.TransactionContextInterface) ([]*CarbonSalesProposal, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"idPerusahaan":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var carbonSalesProposalList []*CarbonSalesProposal


	for _, csp := range queryResult {
		carbonSalesProposalList = append(carbonSalesProposalList, csp)
	}
	

	return carbonSalesProposalList, nil
}

func (s *CSPContract) GetAllCSPByStatus(ctx contractapi.TransactionContextInterface) ([]*CarbonSalesProposal, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"status":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var carbonSalesProposalList []*CarbonSalesProposal


	for _, csp := range queryResult {
		carbonSalesProposalList = append(carbonSalesProposalList, csp)
	}
	

	return carbonSalesProposalList, nil
}
func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*CarbonSalesProposal, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("ER32", err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func (s *CSPContract) GetCSPById(ctx contractapi.TransactionContextInterface) (*CarbonSalesProposal, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	csp, err := getCSPStateById(ctx, id)
	if err != nil {
		return nil, err
	}
	

	return csp, nil
}
func getCompleteDataPerusahaan(ctx contractapi.TransactionContextInterface, csp *CarbonSalesProposal) (*CarbonSalesProposalResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var cspr CarbonSalesProposalResult

	cspr.ID = csp.ID
	cspr.KuotaYangDijual = csp.KuotaYangDijual
	cspr.Status = csp.Status
	perusahaan, err := GetPerusahaanById(ctx, csp.IdPerusahaan)
	if err!=nil {
		return nil, err
	}
	cspr.IdPerusahaan = perusahaan

	return &cspr, nil
}

func GetPerusahaanById(ctx contractapi.TransactionContextInterface, idPerusahaan string) (*Perusahaan, error) {
	// logger.Infof("Run getSpById function with idSp: '%s'.", idSp)

	params := []string{"GetPerusahaanById", idPerusahaan}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode("pecontract", queryArgs, "carbonchannel")
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, "pecontract", response.Message)
	}

	var company Perusahaan
	err := json.Unmarshal([]byte(response.Payload), &company)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &company, nil
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
func (s *CSPContract) UpdateCSP(ctx contractapi.TransactionContextInterface, jsonData string) error {
	

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	var csp CarbonSalesProposal
	err := json.Unmarshal([]byte(jsonData), &csp)
   
	if err != nil {
	 return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
   


	cspRes, err := getCSPStateById(ctx, csp.ID)
	if err != nil {
		return err
	}

	cspRes.ID = csp.ID
	cspRes.IdPerusahaan = csp.IdPerusahaan
	cspRes.Status = csp.Status
	cspRes.KuotaYangDijual = csp.KuotaYangDijual

	cspJSON, err := json.Marshal(cspRes)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(cspRes.ID, cspJSON)
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
