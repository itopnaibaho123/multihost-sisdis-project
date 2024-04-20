package chaincode

import (
	"encoding/json"
	"fmt"
	"math/rand"

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
	Name 		 string `json:"name"`
	IdPerusahaan string `json:"perusahaan"`
	Latitude 	 string `json:"lat"`
	Longitude	 string `json:"long"`
	Lokasi       string `json:"lokasi"`
	IdManajer    string `json:"manajer"`
}

// CreateAsset issues a new asset to the world state with given details.
// CreateDivisi issues a new division to the world state with given details.
func (s *DIVContract) CreateDivisi(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 7 {
		return fmt.Errorf("incorrect number of arguments, expected 7")
	}

	id := args[0]
	name := args[1]
	idPerusahaan := args[2]
	latitude := args[3]
	longitude := args[4]
	lokasi := args[5]
	idManajer := args[6]

	// Check if division with the same name and idPerusahaan already exists
	exists, err := CheckIfDivisiNameExists(ctx, name, idPerusahaan)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("division with name %s already exists in the company %s", name, idPerusahaan)
	}

	dvs := Divisi{
		ID:           id,
		Name:         name,
		IdPerusahaan: idPerusahaan,
		Latitude: 	  latitude,
		Longitude: 	  longitude,
		Lokasi:       lokasi,
		IdManajer:    idManajer,
	}

	dvsJSON, err := json.Marshal(dvs)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, dvsJSON)
	if err != nil {
		return fmt.Errorf("failed to put state: %v", err)
	}

	return nil
}

// CheckIfDivisiNameExists checks if the name of a division is already used by another company
func CheckIfDivisiNameExists(ctx contractapi.TransactionContextInterface, name string, idPerusahaan string) (bool, error) {
    // Construct the composite key using the pattern "name~perusahaan"
    compositeKey, err := ctx.GetStub().CreateCompositeKey("name~perusahaan", []string{name, idPerusahaan})
    if err != nil {
        return false, fmt.Errorf("failed to create composite key: %v", err)
    }

    // Check if the composite key exists
    exists, err := ctx.GetStub().GetState(compositeKey)
    if err != nil {
        return false, fmt.Errorf("failed to read from world state: %v", err)
    }

    return exists != nil, nil
}

func (s *DIVContract) GetAllDIVByIdPerusahaan(ctx contractapi.TransactionContextInterface) ([]*Divisi, error) {
	args := ctx.GetStub().GetStringArgs()[1:]
	queryString := fmt.Sprintf(`{"selector":{"perusahaan":"%s"}}`, args[0])
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}
	var divList []*Divisi


	for _, div := range queryResult {
		divList = append(divList, div)
	}
	return divList, nil
}

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Divisi, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("ER32", err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Divisi, error) {
	// logger.Infof("Run constructQueryResponseFromIterator function.")

	var divisiList []*Divisi

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var divisi Divisi
		err = json.Unmarshal(queryResult.Value, &divisi)
		if err != nil {
			return nil, err
		}
		divisiList = append(divisiList, &divisi)
	}

	return divisiList, nil
}

// ReadAllDivisiByPerusahaan returns all divisions belonging to a specific company (idPerusahaan) from the ledger
func (s *DIVContract) ReadAllDivisiByPerusahaan(ctx contractapi.TransactionContextInterface, idPerusahaan string) ([]*Divisi, error) {
    // Construct a query string to retrieve divisions by idPerusahaan
    queryString := fmt.Sprintf(`{"selector":{"perusahaan":"%s"}}`, idPerusahaan)

    // Get query results from the ledger
    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return nil, fmt.Errorf("failed to get query result: %v", err)
    }
    defer resultsIterator.Close()

    // Construct and return the response from the query results
    return constructQueryResponseFromIterator(resultsIterator)
}

func (s *DIVContract) GetDivisiById(ctx contractapi.TransactionContextInterface) (*Divisi, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	if len(args) != 1 {
	}
	id := args[0]
	
	divisi, err := getDivisiStateById(ctx, id)
	if err != nil {
		return nil, err
	}

	return divisi, nil
}

func getDivisiStateById(ctx contractapi.TransactionContextInterface, id string) (*Divisi, error) {
    divisiJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, fmt.Errorf("failed to read state for division %s: %v", id, err)
    }
    if divisiJSON == nil {
        return nil, fmt.Errorf("division with ID %s does not exist", id)
    }

    var divisi Divisi
    err = json.Unmarshal(divisiJSON, &divisi)
    if err != nil {
        return nil, fmt.Errorf("failed to unmarshal division JSON for ID %s: %v", id, err)
    }

    return &divisi, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *DIVContract) UpdateDivisi(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 5 {
	}

	id := args[0]
	name := args[1]
	lokasi := args[2]
	latitude := args[3]
	longitude := args[4]
	divisi, err := getDivisiStateById(ctx, id)
	if err != nil {
		return err
	}

	divisi.Name = name
	divisi.Lokasi = lokasi
	divisi.Latitude = latitude
	divisi.Longitude = longitude

	divisiJSON, err := json.Marshal(divisi)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, divisiJSON)
	if err != nil {
	}

	return err
}

func (s *DIVContract) UpdateManagerDivisi(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	// logger.Infof("Run UpdateKls function with args: %+q.", args)

	if len(args) != 2 {
	}

	id := args[0]
	manager := args[1]

	divisi, err := getDivisiStateById(ctx, id)
	if err != nil {
		return err
	}

	divisi.IdManajer = manager

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

func isDvsExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {

	dvsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf(err.Error())
	}

	return dvsJSON != nil, nil
}

func (s *DIVContract) SeedDb(ctx contractapi.TransactionContextInterface) error {
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	
	string idPerusahaan := "7f5c4a2b-3e4d-4b8b-9a0a-1e8f9e6f5d0a"
	string idManajer := "9a3e8b7f-1e4d-4b8b-7f5c-1e8f9e6f5d0a"
	string idDivisi := "9f5c4a2b-3e4d-6b8b-9a0a-1e8f9e6f5d0a"
	for i:=1; i < 100000; i++ {
		dvs := Divisi{
			ID:           uuid.New(),
			Name:         RandString(4),
			IdPerusahaan: idPerusahaan,
			Latitude: 	  "1.1",
			Longitude: 	  "1.1",
			Lokasi:       RandString(10),
			IdManajer:    idManajer,
		}
		if(i==1) {
			dvs.ID = idDivisi
		}
	
		dvsJSON, err := json.Marshal(dvs)
		if err != nil {
			return err
		}
	
		err = ctx.GetStub().PutState(id, dvsJSON)
		if err != nil {
			return fmt.Errorf("failed to put state: %v", err)
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
