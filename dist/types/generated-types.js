"use strict";
// To parse this data:
//
//   import { Convert, Order } from "./file";
//
//   const order = Convert.toOrder(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
class Convert {
    static toOrder(json) {
        return cast(JSON.parse(json), r('Order'));
    }
    static orderToJson(value) {
        return JSON.stringify(uncast(value, r('Order')), null, 2);
    }
}
exports.Convert = Convert;
function invalidValue(typ, val, key = '') {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}
function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        const map = {};
        typ.props.forEach((p) => (map[p.json] = { key: p.js, typ: p.typ }));
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}
function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        const map = {};
        typ.props.forEach((p) => (map[p.js] = { key: p.json, typ: p.typ }));
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}
function transform(val, typ, getProps, key = '') {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val)
            return val;
        return invalidValue(typ, val, key);
    }
    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            }
            catch (_) { }
        }
        return invalidValue(typs, val);
    }
    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1)
            return val;
        return invalidValue(cases, val);
    }
    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val))
            return invalidValue('array', val);
        return val.map((el) => transform(el, typ, getProps));
    }
    function transformDate(val) {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue('Date', val);
        }
        return d;
    }
    function transformObject(props, additional, val) {
        if (val === null || typeof val !== 'object' || Array.isArray(val)) {
            return invalidValue('object', val);
        }
        const result = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key)
                ? val[key]
                : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }
    if (typ === 'any')
        return val;
    if (typ === null) {
        if (val === null)
            return val;
        return invalidValue(typ, val);
    }
    if (typ === false)
        return invalidValue(typ, val);
    while (typeof typ === 'object' && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ))
        return transformEnum(typ, val);
    if (typeof typ === 'object') {
        return typ.hasOwnProperty('unionMembers')
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty('arrayItems')
                ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty('props')
                    ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== 'number')
        return transformDate(val);
    return transformPrimitive(typ, val);
}
function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}
function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}
function a(typ) {
    return { arrayItems: typ };
}
function u(...typs) {
    return { unionMembers: typs };
}
function o(props, additional) {
    return { props, additional };
}
function m(additional) {
    return { props: [], additional };
}
function r(name) {
    return { ref: name };
}
const typeMap = {
    Order: o([
        { json: 'id', js: 'id', typ: 0 },
        { json: 'version', js: 'version', typ: 0 },
        { json: 'account', js: 'account', typ: r('Account') },
        { json: 'pair', js: 'pair', typ: '' },
        { json: 'instant', js: 'instant', typ: true },
        { json: 'status', js: 'status', typ: r('PositionStatus') },
        { json: 'leverage', js: 'leverage', typ: r('Leverage') },
        { json: 'position', js: 'position', typ: r('Position') },
        { json: 'take_profit', js: 'take_profit', typ: r('TakeProfit') },
        { json: 'stop_loss', js: 'stop_loss', typ: r('StopLoss') },
        { json: 'note', js: 'note', typ: '' },
        { json: 'skip_enter_step', js: 'skip_enter_step', typ: true },
        { json: 'data', js: 'data', typ: r('OrderData') },
        { json: 'profit', js: 'profit', typ: r('Profit') },
        { json: 'margin', js: 'margin', typ: u(undefined, r('Margin')) },
        {
            json: 'is_position_not_filled',
            js: 'is_position_not_filled',
            typ: u(undefined, true),
        },
        { json: 'editable', js: 'editable', typ: u(undefined, true) },
    ], false),
    Account: o([
        { json: 'id', js: 'id', typ: 0 },
        { json: 'type', js: 'type', typ: '' },
        { json: 'name', js: 'name', typ: '' },
        { json: 'market', js: 'market', typ: '' },
        { json: 'link', js: 'link', typ: '' },
        { json: 'class', js: 'class', typ: u(undefined, '') },
    ], false),
    OrderData: o([
        { json: 'editable', js: 'editable', typ: true },
        {
            json: 'current_price',
            js: 'current_price',
            typ: u(r('CurrentPrice'), null),
        },
        { json: 'target_price_type', js: 'target_price_type', typ: '' },
        { json: 'base_order_finished', js: 'base_order_finished', typ: true },
        {
            json: 'missing_funds_to_close',
            js: 'missing_funds_to_close',
            typ: u(0, ''),
        },
        {
            json: 'liquidation_price',
            js: 'liquidation_price',
            typ: u(undefined, u(null, '')),
        },
        {
            json: 'average_enter_price',
            js: 'average_enter_price',
            typ: u(null, ''),
        },
        {
            json: 'average_close_price',
            js: 'average_close_price',
            typ: u(null, ''),
        },
        {
            json: 'average_enter_price_without_commission',
            js: 'average_enter_price_without_commission',
            typ: u(undefined, u(null, '')),
        },
        {
            json: 'average_close_price_without_commission',
            js: 'average_close_price_without_commission',
            typ: u(undefined, u(null, '')),
        },
        { json: 'panic_sell_available', js: 'panic_sell_available', typ: true },
        { json: 'add_funds_available', js: 'add_funds_available', typ: true },
        { json: 'force_start_available', js: 'force_start_available', typ: true },
        {
            json: 'force_process_available',
            js: 'force_process_available',
            typ: true,
        },
        { json: 'cancel_available', js: 'cancel_available', typ: true },
        { json: 'created_at', js: 'created_at', typ: '' },
        { json: 'updated_at', js: 'updated_at', typ: '' },
        { json: 'type', js: 'type', typ: '' },
        { json: 'closed_at', js: 'closed_at', typ: u(undefined, '') },
    ], false),
    CurrentPrice: o([
        { json: 'bid', js: 'bid', typ: '' },
        { json: 'ask', js: 'ask', typ: '' },
        { json: 'last', js: 'last', typ: '' },
        {
            json: 'day_change_percent',
            js: 'day_change_percent',
            typ: u(undefined, ''),
        },
        { json: 'quote_volume', js: 'quote_volume', typ: u(undefined, '') },
    ], false),
    Leverage: o([
        { json: 'enabled', js: 'enabled', typ: true },
        { json: 'type', js: 'type', typ: u(undefined, '') },
        { json: 'value', js: 'value', typ: u(undefined, '') },
    ], false),
    Margin: o([
        { json: 'amount', js: 'amount', typ: u(null, '') },
        { json: 'total', js: 'total', typ: u(null, '') },
    ], false),
    Position: o([
        { json: 'type', js: 'type', typ: '' },
        { json: 'editable', js: 'editable', typ: true },
        { json: 'units', js: 'units', typ: r('Units') },
        { json: 'price', js: 'price', typ: r('PositionPrice') },
        { json: 'total', js: 'total', typ: r('Total') },
        { json: 'order_type', js: 'order_type', typ: '' },
        { json: 'status', js: 'status', typ: r('PositionStatus') },
        {
            json: 'conditional',
            js: 'conditional',
            typ: u(undefined, r('PositionConditional')),
        },
    ], false),
    PositionConditional: o([
        { json: 'editable', js: 'editable', typ: true },
        { json: 'price', js: 'price', typ: r('PurplePrice') },
        { json: 'order_type', js: 'order_type', typ: '' },
        { json: 'trailing', js: 'trailing', typ: r('Trailing') },
    ], false),
    PurplePrice: o([
        { json: 'value', js: 'value', typ: '' },
        { json: 'type', js: 'type', typ: '' },
    ], false),
    Trailing: o([
        { json: 'enabled', js: 'enabled', typ: true },
        { json: 'percent', js: 'percent', typ: null },
    ], false),
    PositionPrice: o([
        { json: 'value', js: 'value', typ: '' },
        {
            json: 'value_without_commission',
            js: 'value_without_commission',
            typ: u(undefined, u(null, '')),
        },
        { json: 'editable', js: 'editable', typ: true },
    ], false),
    PositionStatus: o([
        { json: 'type', js: 'type', typ: '' },
        { json: 'title', js: 'title', typ: '' },
        { json: 'error', js: 'error', typ: u(undefined, '') },
    ], false),
    Total: o([{ json: 'value', js: 'value', typ: u(null, '') }], false),
    Units: o([
        { json: 'value', js: 'value', typ: '' },
        { json: 'editable', js: 'editable', typ: u(undefined, true) },
    ], false),
    Profit: o([
        { json: 'volume', js: 'volume', typ: u(null, '') },
        { json: 'usd', js: 'usd', typ: u(null, '') },
        { json: 'percent', js: 'percent', typ: u(0, null, '') },
        { json: 'roe', js: 'roe', typ: u(undefined, u(null, '')) },
    ], false),
    StopLoss: o([
        { json: 'enabled', js: 'enabled', typ: true },
        { json: 'order_type', js: 'order_type', typ: u(undefined, '') },
        { json: 'editable', js: 'editable', typ: u(undefined, true) },
        { json: 'price', js: 'price', typ: u(undefined, r('Total')) },
        {
            json: 'conditional',
            js: 'conditional',
            typ: u(undefined, r('StopLossConditional')),
        },
        { json: 'timeout', js: 'timeout', typ: u(undefined, r('Timeout')) },
        { json: 'status', js: 'status', typ: u(undefined, r('StopLossStatus')) },
    ], false),
    StopLossConditional: o([
        { json: 'price', js: 'price', typ: r('StepPrice') },
        { json: 'trailing', js: 'trailing', typ: r('Trailing') },
    ], false),
    StepPrice: o([
        { json: 'value', js: 'value', typ: '' },
        { json: 'type', js: 'type', typ: '' },
        { json: 'percent', js: 'percent', typ: null },
    ], false),
    StopLossStatus: o([
        { json: 'type', js: 'type', typ: '' },
        { json: 'title', js: 'title', typ: '' },
    ], false),
    Timeout: o([
        { json: 'enabled', js: 'enabled', typ: true },
        { json: 'value', js: 'value', typ: u(0, null) },
    ], false),
    TakeProfit: o([
        { json: 'enabled', js: 'enabled', typ: true },
        { json: 'steps', js: 'steps', typ: a(r('Step')) },
    ], false),
    Step: o([
        { json: 'id', js: 'id', typ: 0 },
        { json: 'order_type', js: 'order_type', typ: '' },
        { json: 'editable', js: 'editable', typ: true },
        { json: 'units', js: 'units', typ: u(undefined, r('Total')) },
        { json: 'price', js: 'price', typ: r('StepPrice') },
        { json: 'volume', js: 'volume', typ: u(0, '') },
        { json: 'total', js: 'total', typ: u(undefined, u(null, '')) },
        { json: 'trailing', js: 'trailing', typ: r('Trailing') },
        { json: 'status', js: 'status', typ: r('PositionStatus') },
        { json: 'data', js: 'data', typ: r('StepData') },
        { json: 'position', js: 'position', typ: 0 },
    ], false),
    StepData: o([
        { json: 'cancelable', js: 'cancelable', typ: true },
        { json: 'panic_sell_available', js: 'panic_sell_available', typ: true },
    ], false),
};
