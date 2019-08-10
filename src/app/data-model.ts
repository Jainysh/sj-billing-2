export interface Item {
    id: number,
    category: string,
    description: string,
    grossWeight: number,
    lessWeight: number,
    nettWeight: number,
    rate: number,
    making: number,
    makingType: string,   //per gram or gross
    amount: number,
    comments?: string
}

export interface SavedDescription {
    id: number,
    category: string,
    description: string
}

export interface Less {
    id: number,
    amount: number,
    description: string
}

export interface Bill {
    voucherNo: number,
    date: string,
    customerName: string,
    customerAddress: string,
    customerContact: string,
    isWhatsapp: boolean,
    items: Item[],
    lesses: Less[],
    totalAmount: number,
    paidAmount: number,
    outstandingAmount: number,
    billClear: boolean,
    narration?: string
}