package main

import(
	"log"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"io"
	"fmt"
	"time"
	"encoding/json"
	"github.com/gorilla/mux"

)
//go mod tidy
type Block struct{
	pso			int
	Data        BlockCheckout
	Timestamp	string
	Hash		string
	PrevHash	string

}	
type BlockCheckout struct{
	BoookID 		string   	'json:"book_id"'
	user			string		'json:"user"'
	checkoutDate	string		'json:"checkout_date"'
	IsGensis		bool		'json:"is_genesis"'
}
type Book struct{
	ID 			string  	'json:"id"'
	Title 		string		'json:"title"'
	Author 		string		'json:"author"'
	PublishDate string		'json:"publish_date"'
	ISBN 		string		'json:"isbn "'
	
	
	
	
}
type Blockchain struct{
	blocks []*Block
}
 var Blockchain *Blockchain

 func createblock(prevBlock *Block, checkoutitem BookCheckout) *Block {
	block := &Block
	block.pos = prevBlock + 1
	block.Timestamp = time.Now().string()
	block.PrevHash = prevBlock.Hash
 }

 func (bc *Blockchain)AddBlock(data BookCheckout)  {
	prevBlock :=bc.blocks[len(bc.blocks)-1]

	block := createblock(prevBlock, data)
	if validBlock(block, prevBlock) {
		bc.blocks =append(bc.blocks,block)
	}
 }


 func writeBlock(w http.ResponseWriter,r *http.Request)  {
	var checkoutitem BookCheckout

	if err := json.NewDecoder(r.body).Decode(&checkoutitem);err != nil{
		r.writeHeader(http.StatusInternalServerError)
		log.printf("could not write block:%v", err)
		w.write([]byte("could not create block"))
		
	}
	 Blockchain.AddBlock(checkoutitem)
 }

func newBook(w http.ResponseWriter,r *http.Request)  {
	var book Book

	if err != json.NewDecoder(r.Body).Decode(&book); err != nil{

		w.writeHeader(http.StatusInternalServerError)
		log.printf("could not create:%v", err)
		w.write([]byte("could not create new book"))
		return
	}	
	h :=md5.New()
	io.writeString(h, book.ISBN+book.PublishDate)
	book.ID =fmt.Sprintf("%x",h.sum(nil))


	resp,err:=json.MarshalIndent(book, "", " ")
	if err != nil {
		w.writeHeader(http.StatusInternalServerError)
		log.printf("could not marshal payload: %v", err)
		w.write([]byte("could not save book data"))
		return
	}	
	w.writeHeader(http.statusOk)
	w.write(resp)
}
func main()  {
	r := mux.NewRouter() 
	r.HandleFunc("/",getBlockchain).Methods("GET")
	r.HandleFunc("/",writeBlock).Methods("POST")
	r.HandleFunc("/", newBook).Methods("POST")

	log.println("listening on port 3000")
	log.fatal(http.ListenAndServer(":3000", r))
	 
}