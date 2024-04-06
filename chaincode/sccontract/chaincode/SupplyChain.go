package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SCContract struct {
	contractapi.Contract
}

type SupplyChain struct {
	ID                  string   `json:"id"`
	ListPerusahaan      []string `json:"listPerusahaan"`
	Status              string   `json:"status"`
	ProposalSupplyChain []ProposalSupplyChain `json:"proposalSupplyChain"`
}

type ProposalSupplyChain struct {
	IdPerusahaan string `json:"id"`
	Status       string `json:"status"`
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")

// CreateAsset issues a new asset to the world state with given details.
func (s *SCContract) CreateSC(ctx contractapi.TransactionContextInterface, jsonData string) error {

	var sc SupplyChain
	err := json.Unmarshal([]byte(jsonData), &sc)
   
	if err != nil {
	 return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
   
	scJSON, err := json.Marshal(sc)
	if err != nil {
	 return err
	}
   
	err = ctx.GetStub().PutState(sc.ID, scJSON)
	if err != nil {
	 fmt.Errorf(err.Error())
	}
   
	return err
}

func isSCExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	scJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return scJSON != nil, nil
}
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*SupplyChain, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var scList []*SupplyChain

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
		}

		var sc SupplyChain
		err = json.Unmarshal(queryResult.Value, &sc)
		if err != nil {
		}
		scList = append(scList, &sc)
	}

	return scList, nil
}

// ReadAsset returns the asset stored in the world state with given id.
func (s *SCContract) ReadAllSC(ctx contractapi.TransactionContextInterface) ([]*SupplyChain, error) {
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

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*SupplyChain, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("ER32", err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func (s *SCContract) GetSCById(ctx contractapi.TransactionContextInterface) (*SupplyChain, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	csp, err := getSCStateById(ctx, id)
	if err != nil {
		return nil, err
	}

	return csp, nil
}
func getCompleteDataPerusahaan(ctx contractapi.TransactionContextInterface, sc *SupplyChain) (*SupplyChain, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	return sc, nil
}
func getSCStateById(ctx contractapi.TransactionContextInterface, id string) (*SupplyChain, error) {

	scJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	}
	if scJSON == nil {
	}

	var sc SupplyChain
	err = json.Unmarshal(scJSON, &sc)
	if err != nil {
	}

	return &sc, nil
}

func (s *SCContract) GetAllSCByStatus(ctx contractapi.TransactionContextInterface) ([]*SupplyChain, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"status":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var scList []*SupplyChain


	for _, sc := range queryResult {
		scList = append(scList, sc)
	}
	return scList, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *SCContract) UpdateSC(ctx contractapi.TransactionContextInterface, jsonData string) error {


	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	var sc SupplyChain
	err := json.Unmarshal([]byte(jsonData), &sc)
   
	if err != nil {
	 return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
   


	scRes, err := getSCStateById(ctx, sc.ID)
	if err != nil {
		return err
	}

	scRes.ID = sc.ID
	scRes.ListPerusahaan = sc.ListPerusahaan
	scRes.Status = sc.Status
	scRes.ProposalSupplyChain = sc.ProposalSupplyChain

	scJSON, err := json.Marshal(scRes)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(scRes.ID, scJSON)
	if err != nil {
	}

	return err
}

// DeleteAsset deletes an given asset from the world state.
func (s *SCContract) DeleteSC(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}

	id := args[0]

	exists, err := isSCExists(ctx, id)
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
