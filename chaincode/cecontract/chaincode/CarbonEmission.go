package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"

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
	TotalEmisi   float64   `json:"totalEmisi"`
}

type CarbonEmissionResult struct {
	ID         	string      	`json:"id"`
	Perusahaan 	*Perusahaan 	`json:"perusahaan"`
	TotalEmisi   float64      	`json:"totalEmisi"`
	Perjalanan  []* Perjalanan 	`json:"perjalanan"`
}


type Perjalanan struct {
	ID                  string   `json:"id"`
	IdPerusahaan 	 	string   `json:"idPerusahaan"`
	IdSupplyChain       string   `json:"idSupplyChain"`
	IdDivisiPengirim    string   `json:"idDivisiPengirim"`
	IdDivisiPenerima    string   `json:"idDivisiPenerima"`
	Status              string   `json:"status"`
	WaktuBerangkat      string   `json:"waktuBerangkat"`
	WaktuSampai         string   `json:"waktuSampai"`
	IdTransportasi      string   `json:"idTransportasi"`
	BeratMuatan         string   `json:"beratMuatan"`
	EmisiKarbon         string   `json:"emisiKarbon"`
	// IdEmisiKarbon	    string   `json:"idEmisiKarbon"`
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
func (s *CEContract) CreateCE(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 4 {
		return fmt.Errorf("incorrect number of arguments. expecting 4")
	}

	id := args[0]
	idPerusahaan := args[1]
	emission := args[2]
	IdPerjalanan := args[3]
	

	// Convert emission to integer
	totalEmisi, err := strconv.ParseFloat(emission, 64)
	if err != nil {
		return fmt.Errorf("error converting emission to integer: %s", err)
	}

	// Query existing CarbonEmission by idPerusahaan
	emissions, err := s.GetCEByPerusahaan(ctx, idPerusahaan)
	if err != nil {
		return fmt.Errorf("error querying carbon emission by perusahaan ID: %s", err)
	}

	if len(emissions) > 0 {
		// Assuming there should only be one emission record per idPerusahaan
		existingCE := emissions[0]
		existingCE.TotalEmisi += totalEmisi
		existingCE.IdPerjalanan = append(existingCE.IdPerjalanan, IdPerjalanan)

		// Marshal the updated carbon emission
		updatedCEJSON, err := json.Marshal(existingCE)
		if err != nil {
			return fmt.Errorf("error marshalling updated carbon emission: %s", err)
		}

		// Put the updated carbon emission back to the ledger
		err = ctx.GetStub().PutState(idPerusahaan, updatedCEJSON)
		if err != nil {
			return fmt.Errorf("failed to put updated carbon emission: %s", err)
		}
	} else {
		// Create new CarbonEmission if not existing
		newCE := CarbonEmission{
			ID:           id,
			IdPerusahaan: idPerusahaan,
			TotalEmisi:   totalEmisi,
			IdPerjalanan: []string{IdPerjalanan},
		}

		newCEJSON, err := json.Marshal(newCE)
		if err != nil {
			return fmt.Errorf("error marshalling new carbon emission: %s", err)
		}

		err = ctx.GetStub().PutState(idPerusahaan, newCEJSON)
		if err != nil {
			return fmt.Errorf("failed to put new carbon emission: %s", err)
		}
	}

	return nil
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

func (s *CEContract) GetCEByPerusahaan(ctx contractapi.TransactionContextInterface, idPerusahaan string) ([]*CarbonEmission, error) {
	queryString := fmt.Sprintf(`{"selector":{"perusahaan":"%s"}}`, idPerusahaan)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var emissions []*CarbonEmission
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var emission CarbonEmission
		err = json.Unmarshal(queryResponse.Value, &emission)
		if err != nil {
			return nil, err
		}
		emissions = append(emissions, &emission)
	}
	return emissions, nil
}

func getCompleteDataCE(ctx contractapi.TransactionContextInterface, carbonEmission *CarbonEmission) (*CarbonEmissionResult, error) {
	// logger.Infof("Run getCompleteDataKls function with kls id: '%s'.", perusahaan.ID)

	var carbonEmissionResult CarbonEmissionResult

	carbonEmissionResult.ID = carbonEmission.ID
	carbonEmissionResult.TotalEmisi = carbonEmission.TotalEmisi

	perjalanan, err := getAllPerjalanan(ctx, carbonEmission.IdPerjalanan)
	if err!=nil {
		return nil, err
	}

	var perjalananPointers []*Perjalanan
    for i := range perjalanan {
        perjalananPointers = append(perjalananPointers, &perjalanan[i])
    }

	carbonEmissionResult.Perjalanan = perjalananPointers


	perusahaan, err := GetPerusahaanById(ctx, carbonEmission.IdPerusahaan)
	if err!=nil {
		return nil, err
	}
	carbonEmissionResult.Perusahaan = perusahaan

	return &carbonEmissionResult, nil
}

func getAllPerjalanan(ctx contractapi.TransactionContextInterface, perjalanan []string) ([]Perjalanan, error) {
    var perjalananResult []Perjalanan

    for i := 0; i < len(perjalanan); i++ {
        params := []string{"GetShipmentByIdNotFull", perjalanan[i]}
        queryArgs := make([][]byte, len(params))
        for j, arg := range params {
            queryArgs[j] = []byte(arg)
        }

        response := ctx.GetStub().InvokeChaincode("shcontract", queryArgs, "carbonchannel")
        if response.Status != shim.OK {
            return nil, fmt.Errorf(ER37, "shcontract", response.Message)
        }

        var perjalanan Perjalanan
        err := json.Unmarshal(response.Payload, &perjalanan)
        if err != nil {
            return nil, fmt.Errorf(ER34, err)
        }
        perjalananResult = append(perjalananResult, perjalanan)
    }

    return perjalananResult, nil
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

	if len(args) != 3 {
	}

	id := args[0]
	totalEmisiStr := args[1]
	totalEmisi, err := strconv.ParseFloat(totalEmisiStr, 64)
	if err != nil {
	}
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

func isCeExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	ceJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return ceJSON != nil, nil
}