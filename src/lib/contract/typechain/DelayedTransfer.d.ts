/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface DelayedTransferInterface extends ethers.utils.Interface {
  functions: {
    "addGovernor(address)": FunctionFragment;
    "delayPeriod()": FunctionFragment;
    "delayThresholds(address)": FunctionFragment;
    "delayedTransfers(bytes32)": FunctionFragment;
    "governors(address)": FunctionFragment;
    "isGovernor(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removeGovernor(address)": FunctionFragment;
    "renounceGovernor()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setDelayPeriod(uint256)": FunctionFragment;
    "setDelayThresholds(address[],uint256[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "addGovernor", values: [string]): string;
  encodeFunctionData(
    functionFragment: "delayPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "delayThresholds",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "delayedTransfers",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "governors", values: [string]): string;
  encodeFunctionData(functionFragment: "isGovernor", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeGovernor",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceGovernor",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setDelayPeriod",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setDelayThresholds",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "delayPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "delayThresholds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "delayedTransfers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governors", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isGovernor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceGovernor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDelayPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDelayThresholds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "DelayPeriodUpdated(uint256)": EventFragment;
    "DelayThresholdUpdated(address,uint256)": EventFragment;
    "DelayedTransferAdded(bytes32)": EventFragment;
    "DelayedTransferExecuted(bytes32,address,address,uint256)": EventFragment;
    "GovernorAdded(address)": EventFragment;
    "GovernorRemoved(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DelayPeriodUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DelayThresholdUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DelayedTransferAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DelayedTransferExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GovernorAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "GovernorRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export class DelayedTransfer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: DelayedTransferInterface;

  functions: {
    addGovernor(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    delayPeriod(overrides?: CallOverrides): Promise<[BigNumber]>;

    delayThresholds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    delayedTransfers(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        receiver: string;
        token: string;
        amount: BigNumber;
        timestamp: BigNumber;
      }
    >;

    governors(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    isGovernor(_account: string, overrides?: CallOverrides): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removeGovernor(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceGovernor(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDelayPeriod(
      _period: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDelayThresholds(
      _tokens: string[],
      _thresholds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addGovernor(
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  delayPeriod(overrides?: CallOverrides): Promise<BigNumber>;

  delayThresholds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  delayedTransfers(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber] & {
      receiver: string;
      token: string;
      amount: BigNumber;
      timestamp: BigNumber;
    }
  >;

  governors(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  isGovernor(_account: string, overrides?: CallOverrides): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  removeGovernor(
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceGovernor(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDelayPeriod(
    _period: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDelayThresholds(
    _tokens: string[],
    _thresholds: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addGovernor(_account: string, overrides?: CallOverrides): Promise<void>;

    delayPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    delayThresholds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    delayedTransfers(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber] & {
        receiver: string;
        token: string;
        amount: BigNumber;
        timestamp: BigNumber;
      }
    >;

    governors(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    isGovernor(_account: string, overrides?: CallOverrides): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    removeGovernor(_account: string, overrides?: CallOverrides): Promise<void>;

    renounceGovernor(overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setDelayPeriod(
      _period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setDelayThresholds(
      _tokens: string[],
      _thresholds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    DelayPeriodUpdated(
      period?: null
    ): TypedEventFilter<[BigNumber], { period: BigNumber }>;

    DelayThresholdUpdated(
      token?: null,
      threshold?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { token: string; threshold: BigNumber }
    >;

    DelayedTransferAdded(id?: null): TypedEventFilter<[string], { id: string }>;

    DelayedTransferExecuted(
      id?: null,
      receiver?: null,
      token?: null,
      amount?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { id: string; receiver: string; token: string; amount: BigNumber }
    >;

    GovernorAdded(
      account?: null
    ): TypedEventFilter<[string], { account: string }>;

    GovernorRemoved(
      account?: null
    ): TypedEventFilter<[string], { account: string }>;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;
  };

  estimateGas: {
    addGovernor(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    delayPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    delayThresholds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    delayedTransfers(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    governors(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    isGovernor(_account: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removeGovernor(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceGovernor(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDelayPeriod(
      _period: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDelayThresholds(
      _tokens: string[],
      _thresholds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addGovernor(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    delayPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    delayThresholds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    delayedTransfers(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    governors(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isGovernor(
      _account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeGovernor(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceGovernor(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDelayPeriod(
      _period: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDelayThresholds(
      _tokens: string[],
      _thresholds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}