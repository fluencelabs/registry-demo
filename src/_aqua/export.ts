/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.6.1-279
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v2';


// Services

export interface DiscoveryServiceDef {
    notify_discovered: (discoveredUser: { route: string; userName: string; }, callParams: CallParams<'discoveredUser'>) => { route: string; userName: string; }[] | Promise<{ route: string; userName: string; }[]>;
}
export function registerDiscoveryService(service: DiscoveryServiceDef): void;
export function registerDiscoveryService(serviceId: string, service: DiscoveryServiceDef): void;
export function registerDiscoveryService(peer: FluencePeer, service: DiscoveryServiceDef): void;
export function registerDiscoveryService(peer: FluencePeer, serviceId: string, service: DiscoveryServiceDef): void;
       

export function registerDiscoveryService(...args: any) {
    registerService(
        args,
        {
    "defaultServiceId" : "discoveryService",
    "functions" : [
        {
            "functionName" : "notify_discovered",
            "argDefs" : [
                {
                    "name" : "discoveredUser",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        }
    ]
}
    );
}
      
// Functions
export type NotifySelfDiscoveredArgSelf = { route: string; userName: string; } 

export function notifySelfDiscovered(
    self: NotifySelfDiscoveredArgSelf,
    config?: {ttl?: number}
): Promise<string>;

export function notifySelfDiscovered(
    peer: FluencePeer,
    self: NotifySelfDiscoveredArgSelf,
    config?: {ttl?: number}
): Promise<string>;

export function notifySelfDiscovered(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (call %init_peer_id% ("getDataSrv" "self") [] self)
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") ["ok"])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "notifySelfDiscovered",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "self",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}

 

export function createMyRoute(
    label: string,
    value: string,
    config?: {ttl?: number}
): Promise<string>;

export function createMyRoute(
    peer: FluencePeer,
    label: string,
    value: string,
    config?: {ttl?: number}
): Promise<string>;

export function createMyRoute(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                        (call %init_peer_id% ("getDataSrv" "label") [] label)
                       )
                       (call %init_peer_id% ("getDataSrv" "value") [] value)
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") ["route id"])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "createMyRoute",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "label",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "value",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
