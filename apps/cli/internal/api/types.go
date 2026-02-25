package api

type CreateInvoiceRequest struct {
	ReceiveToken   string `json:"receiveToken"`
	ReceiveNetwork string `json:"receiveNetwork"`
	Amount         string `json:"amount"`
	WalletAddress  string `json:"walletAddress"`
	Description    string `json:"description,omitempty"`
	BuyerName      string `json:"buyerName,omitempty"`
	BuyerEmail     string `json:"buyerEmail,omitempty"`
	BuyerAddress   string `json:"buyerAddress,omitempty"`
}

type CreateInvoiceResponse struct {
	ID string `json:"id"`
}

type QuoteRequest struct {
	PayToken      string `json:"payToken"`
	PayNetwork    string `json:"payNetwork"`
	RefundAddress string `json:"refundAddress"`
}

type QuoteResponse struct {
	DepositAddress string `json:"depositAddress"`
	DepositMemo    string `json:"depositMemo,omitempty"`
	AmountIn       string `json:"amountIn"`
	AmountOut      string `json:"amountOut"`
	TimeEstimate   any    `json:"timeEstimate"`
	ExpiresAt      string `json:"expiresAt"`
}

type InvoiceResponse struct {
	ID                  string              `json:"id"`
	Status              string              `json:"status"`
	Invoice             InvoiceDetails      `json:"invoice"`
	PaymentInstructions PaymentInstructions `json:"paymentInstructions"`
	Timeline            InvoiceTimeline     `json:"timeline"`
}

type InvoiceDetails struct {
	ID             string  `json:"id"`
	Amount         string  `json:"amount"`
	ReceiveToken   string  `json:"receiveToken"`
	ReceiveNetwork string  `json:"receiveNetwork"`
	WalletAddress  string  `json:"walletAddress"`
	Description    *string `json:"description"`
	BuyerName      *string `json:"buyerName"`
	BuyerEmail     *string `json:"buyerEmail"`
	BuyerAddress   *string `json:"buyerAddress"`
	CreatedAt      string  `json:"createdAt"`
	UpdatedAt      string  `json:"updatedAt"`
}

type PaymentInstructions struct {
	PayToken       *string `json:"payToken"`
	PayNetwork     *string `json:"payNetwork"`
	DepositAddress *string `json:"depositAddress"`
	DepositMemo    *string `json:"depositMemo"`
	AmountIn       *string `json:"amountIn"`
	ExpiresAt      *string `json:"expiresAt"`
	PaidAt         *string `json:"paidAt"`
}

type InvoiceTimeline struct {
	CurrentStatus      string  `json:"currentStatus"`
	IsTerminal         bool    `json:"isTerminal"`
	CreatedAt          string  `json:"createdAt"`
	QuotedAt           *string `json:"quotedAt"`
	ExpiresAt          *string `json:"expiresAt"`
	PaidAt             *string `json:"paidAt"`
	CompletedAt        *string `json:"completedAt"`
	FailedAt           *string `json:"failedAt"`
	RefundedAt         *string `json:"refundedAt"`
	ExpiredAt          *string `json:"expiredAt"`
	LastStatusChangeAt string  `json:"lastStatusChangeAt"`
}
