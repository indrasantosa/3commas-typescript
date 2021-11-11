"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const ws_1 = __importDefault(require("ws"));
const crypto_1 = require("./lib/crypto");
const generated_types_1 = require("./types/generated-types");
const ENDPOINT = 'https://api.3commas.io';
const V1 = '/public/api/ver1';
const V2 = '/public/api/v2';
const WS = 'wss://ws.3commas.io/websocket';
class API {
    constructor(options) {
        var _a, _b, _c;
        this.KEY = (_a = options === null || options === void 0 ? void 0 : options.key) !== null && _a !== void 0 ? _a : '';
        this.SECRETS = (_b = options === null || options === void 0 ? void 0 : options.secrets) !== null && _b !== void 0 ? _b : '';
        this.errorHandler = options === null || options === void 0 ? void 0 : options.errorHandler;
        this.axios = axios_1.default.create({
            baseURL: ENDPOINT,
            timeout: (_c = options === null || options === void 0 ? void 0 : options.timeout) !== null && _c !== void 0 ? _c : 30000,
            headers: Object.assign({ APIKEY: this.KEY }, ((options === null || options === void 0 ? void 0 : options.forcedMode) && { 'Forced-Mode': options === null || options === void 0 ? void 0 : options.forcedMode })),
        });
        this.axios.interceptors.request.use((config) => {
            let data = Object.assign(Object.assign({}, config.data), { api_key: this.KEY, secret: this.SECRETS });
            let payload = JSON.stringify(data);
            if (config.method === 'get') {
                payload = qs_1.default.stringify(config.params);
                data = null;
            }
            const relativeUrl = config.url.replace(config.baseURL, '');
            const signature = this.SECRETS
                ? (0, crypto_1.sign)(this.SECRETS, relativeUrl, payload)
                : '';
            const newConfig = Object.assign(Object.assign({}, config), { data, headers: Object.assign(Object.assign({}, config.headers), { signature }) });
            return newConfig;
        }, (error) => {
            return Promise.reject(error);
        });
    }
    request(method, version, path, payload) {
        return new Promise(async (resolve, reject) => {
            var _a, _b, _c;
            try {
                const { data } = await this.axios({
                    method,
                    url: `${ENDPOINT}${version === 1 ? V1 : V2}${path}`,
                    params: method === 'GET' ? payload : undefined,
                    data: method !== 'GET' ? payload : undefined,
                });
                resolve(data);
            }
            catch (e) {
                const error = e;
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) && this.errorHandler) {
                    await this.errorHandler(error.response.data, reject);
                }
                reject((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : error);
            }
        });
    }
    async ping() {
        return await this.request('GET', 1, '/ping');
    }
    async time() {
        return await this.request('GET', 1, '/time');
    }
    async transfer(params) {
        return await this.request('POST', 1, '/accounts/transfer', params);
    }
    async getTransferHistory(params) {
        return await this.request('GET', 1, '/accounts/transfer_history', params);
    }
    async getTransferData() {
        return await this.request('GET', 1, '/accounts/transfer_data');
    }
    async addExchangeAccount(params) {
        return await this.request('POST', 1, '/accounts/new', params);
    }
    async editExchangeAccount(params) {
        return await this.request('POST', 1, '/accounts/update', params);
    }
    async getExchange() {
        return await this.request('GET', 1, '/accounts');
    }
    async getMarketList() {
        return await this.request('GET', 1, '/accounts/market_list');
    }
    async getMarketPairs(params) {
        return await this.request('GET', 1, '/accounts/market_pairs', params);
    }
    async getCurrencyRate(params) {
        return await this.request('GET', 1, '/accounts/currency_rates', params);
    }
    async getCurrencyRateWithLeverageData(params) {
        return await this.request('GET', 1, '/accounts/currency_rates_with_leverage_data', params);
    }
    async getActiveTradeEntities(account_id) {
        return await this.request('GET', 1, `/accounts/${account_id}/active_trading_entities`);
    }
    async sellAllToUSD(account_id) {
        return await this.request('POST', 1, `/accounts/${account_id}/sell_all_to_usd`);
    }
    async sellAllToBTC(account_id) {
        return await this.request('POST', 1, `/accounts/${account_id}/sell_all_to_btc`);
    }
    async getBalanceChartData(account_id, params) {
        return await this.request('GET', 1, `/accounts/${account_id}/balance_chart_data`, params);
    }
    async loadBalances(account_id) {
        return await this.request('POST', 1, `/accounts/${account_id}/load_balances`);
    }
    async renameExchangeAccount(account_id, name) {
        return await this.request('POST', 1, `/accounts/${account_id}/rename`, {
            name,
        });
    }
    async removeExchangeAccount(account_id) {
        return await this.request('POST', 1, `/accounts/${account_id}/remove`);
    }
    async getPieChartData(account_id) {
        return await this.request('POST', 1, `/accounts/${account_id}/pie_chart_data`);
    }
    async getAccountTableData(account_id) {
        return await this.request('POST', 1, `/accounts/${account_id}/account_table_data`);
    }
    async getAccountInfo(account_id) {
        return await this.request('GET', 1, `/accounts/${account_id !== null && account_id !== void 0 ? account_id : 'summary'}`);
    }
    async getLeverageData(account_id, pair) {
        return await this.request('GET', 1, `/accounts/${account_id}/leverage_data`, { pair });
    }
    async changeUserMode(mode) {
        return await this.request('POST', 1, '/users/change_mode', { mode });
    }
    async getSmartTradeHistory(params) {
        return await this.request('GET', 2, '/smart_trades', params);
    }
    async smartTrade(params) {
        return await this.request('POST', 2, '/smart_trades', params);
    }
    async getSmartTrade(id) {
        return await this.request('GET', 2, `/smart_trades/${id}`);
    }
    async cancelSmartTrade(id) {
        return await this.request('DELETE', 2, `/smart_trades/${id}`);
    }
    async updateSmartTrade(id, params) {
        return await this.request('PATCH', 2, `/smart_trades/${id}`, params);
    }
    async averageSmartTrade(id, params) {
        return await this.request('POST', 2, `/smart_trades/${id}/add_funds`, params);
    }
    async reduceFund(id, params) {
        return await this.request('POST', 2, `/smart_trades/${id}/reduce_funds`, params);
    }
    async closeSmartTrade(id) {
        return await this.request('POST', 2, `/smart_trades/${id}/close_by_market`);
    }
    async forceStartSmartTrade(id) {
        return await this.request('POST', 2, `/smart_trades/${id}/force_start`);
    }
    async forceProcessSmartTrade(id) {
        return await this.request('POST', 2, `/smart_trades/${id}/force_process`);
    }
    async setNoteSmartTrade(id, note) {
        return await this.request('POST', 2, `/smart_trades/${id}/set_note`, {
            note,
        });
    }
    /**
     * Get the sub trades of a smart trade, including entry and take profit orders.
     *
     * @param id smart trade id
     * @returns SmartTrade Order
     */
    async getSubTrade(id) {
        return await this.request('GET', 2, `/smart_trades/${id}/trades`);
    }
    async closeSubTrade(smartTradeId, subTradeId) {
        return await this.request('POST', 2, `/smart_trades/${smartTradeId}/trades/${subTradeId}/close_by_market`);
    }
    async cancelSubTrade(smartTradeId, subTradeId) {
        return await this.request('DELETE', 2, `/smart_trades/${smartTradeId}/trades/${subTradeId}`);
    }
    /**
     * Bots methods
     */
    async botCreate(params) {
        return await this.request('POST', 1, '/bots/create_bot?', params);
    }
    async getBots(params = {
        limit: 50,
        sort_by: 'created_at',
        sort_direction: 'desc',
    }) {
        return await this.request('GET', 1, '/bots', params);
    }
    async getBotsStats(params) {
        return await this.request('GET', 1, '/bots/stats', params);
    }
    async getBot(id) {
        return await this.request('GET', 1, `/bots/${id}/show`);
    }
    async getDeals(params = {
        limit: 50,
        order: 'created_at',
        order_direction: 'desc',
    }) {
        return await this.request('GET', 1, '/deals', params);
    }
    async getDeal(id) {
        return await this.request('GET', 1, `/deals/${id}/show`);
    }
    async getDealSafetyOrders(id) {
        return await this.request('GET', 1, `/deals/${id}/market_orders`);
    }
    async botUpdate(params) {
        return await this.request('PATCH', 1, `/bots/${params.bot_id}/update?`, params);
    }
    async botDisable(bot_id) {
        return await this.request('POST', 1, `/bots/${bot_id}/disable?`, {
            bot_id,
        });
    }
    async botEnable(bot_id) {
        return await this.request('POST', 1, `/bots/${bot_id}/enable?`, { bot_id });
    }
    async botStartNewDeal(params) {
        return await this.request('POST', 1, `/bots/${params.bot_id}/start_new_deal?`, params);
    }
    async botDelete(bot_id) {
        return await this.request('POST', 1, `/bots/${bot_id}/delete?`, { bot_id });
    }
    async botPaniceSellAllDeals(bot_id) {
        return await this.request('POST', 1, `/bots/${bot_id}/panic_sell_all_deals?`, {
            bot_id,
        });
    }
    async botCancelAllDeals(bot_id) {
        return await this.request('POST', 1, `/bots/${bot_id}/cancel_all_deals?`, {
            bot_id,
        });
    }
    async botShow(bot_id) {
        return await this.request('GET', 1, `/bots/${bot_id}/show?`, {
            bot_id,
        });
    }
    async customRequest(method, version, path, payload) {
        return await this.request(method, version, path, payload);
    }
    // Websocket
    buildIdentifier(channel, url) {
        const idetifier = {
            channel,
            users: [
                {
                    api_key: this.KEY,
                    signature: (0, crypto_1.sign)(this.SECRETS, url),
                },
            ],
        };
        return JSON.stringify(idetifier);
    }
    subscribe(channel, url, callback) {
        const payload = JSON.stringify({
            identifier: this.buildIdentifier(channel, url),
            command: 'subscribe',
        });
        const setUpWebsocketListener = (callback) => {
            var _a, _b;
            if (callback) {
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.on('message', (data, isBinary) => {
                    const message = isBinary ? data : data.toString();
                    callback(message);
                });
            }
            (_b = this.ws) === null || _b === void 0 ? void 0 : _b.on('close', (code) => {
                if (code === 1006) {
                    setUpWebsocket(payload);
                }
            });
        };
        const setUpWebsocket = (payload) => {
            this.ws = new ws_1.default(WS);
            this.ws.onopen = () => { var _a; return (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(payload); };
            setUpWebsocketListener(callback);
        };
        if (!this.ws) {
            setUpWebsocket(payload);
        }
        else {
            this.ws.send(payload);
        }
    }
    subscribeSmartTrade(callback) {
        this.subscribe('SmartTradesChannel', '/smart_trades', callback);
    }
    subscribeDeal(callback) {
        this.subscribe('DealsChannel', '/deals', callback);
    }
    // 3Commas does not support unsubscribe a channel
    unsubscribe() {
        if (this.ws) {
            this.ws.close();
        }
    }
    /**
     * Validate the response order is consistent with the generated type
     * Or, an error is thrown
     *
     * @param order order
     */
    validateOrderType(order) {
        return generated_types_1.Convert.toOrder(JSON.stringify(order));
    }
}
exports.API = API;
