export interface Order {
    id: number;
    version: number;
    account: Account;
    pair: string;
    instant: boolean;
    status: PositionStatus;
    leverage: Leverage;
    position: Position;
    take_profit: TakeProfit;
    stop_loss: StopLoss;
    note: string;
    skip_enter_step: boolean;
    data: OrderData;
    profit: Profit;
    margin?: Margin;
    is_position_not_filled?: boolean;
    editable?: boolean;
}
export interface Account {
    id: number;
    type: string;
    name: string;
    market: string;
    link: string;
    class?: string;
}
export interface OrderData {
    editable: boolean;
    current_price: CurrentPrice | null;
    target_price_type: string;
    base_order_finished: boolean;
    missing_funds_to_close: number | string;
    liquidation_price?: null | string;
    average_enter_price: null | string;
    average_close_price: null | string;
    average_enter_price_without_commission?: null | string;
    average_close_price_without_commission?: null | string;
    panic_sell_available: boolean;
    add_funds_available: boolean;
    force_start_available: boolean;
    force_process_available: boolean;
    cancel_available: boolean;
    created_at: string;
    updated_at: string;
    type: string;
    closed_at?: string;
}
export interface CurrentPrice {
    bid: string;
    ask: string;
    last: string;
    day_change_percent?: string;
    quote_volume?: string;
}
export interface Leverage {
    enabled: boolean;
    type?: string;
    value?: string;
}
export interface Margin {
    amount: null | string;
    total: null | string;
}
export interface Position {
    type: string;
    editable: boolean;
    units: Units;
    price: PositionPrice;
    total: Total;
    order_type: string;
    status: PositionStatus;
    conditional?: PositionConditional;
}
export interface PositionConditional {
    editable: boolean;
    price: PurplePrice;
    order_type: string;
    trailing: Trailing;
}
export interface PurplePrice {
    value: string;
    type: string;
}
export interface Trailing {
    enabled: boolean;
    percent: null;
}
export interface PositionPrice {
    value: string;
    value_without_commission?: null | string;
    editable: boolean;
}
export interface PositionStatus {
    type: string;
    title: string;
    error?: string;
}
export interface Total {
    value: null | string;
}
export interface Units {
    value: string;
    editable?: boolean;
}
export interface Profit {
    volume: null | string;
    usd: null | string;
    percent: number | null | string;
    roe?: null | string;
}
export interface StopLoss {
    enabled: boolean;
    order_type?: string;
    editable?: boolean;
    price?: Total;
    conditional?: StopLossConditional;
    timeout?: Timeout;
    status?: StopLossStatus;
}
export interface StopLossConditional {
    price: StepPrice;
    trailing: Trailing;
}
export interface StepPrice {
    value: string;
    type: string;
    percent: null;
}
export interface StopLossStatus {
    type: string;
    title: string;
}
export interface Timeout {
    enabled: boolean;
    value: number | null;
}
export interface TakeProfit {
    enabled: boolean;
    steps: Step[];
}
export interface Step {
    id: number;
    order_type: string;
    editable: boolean;
    units?: Total;
    price: StepPrice;
    volume: number | string;
    total?: null | string;
    trailing: Trailing;
    status: PositionStatus;
    data: StepData;
    position: number;
}
export interface StepData {
    cancelable: boolean;
    panic_sell_available: boolean;
}
export declare class Convert {
    static toOrder(json: string): Order;
    static orderToJson(value: Order): string;
}
