import { Order } from "../generated/schema";
import {
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipRenounced,
  OwnershipTransferred,
} from "../generated/WyvernExchangeV2/WyvernExchangeV2";

// WyvernではOrder時のイベントのストレージサイズが制約に引っかかるため、2つに分けている
export function handleOrderApprovedPartOne(event: OrderApprovedPartOne): void {
  // event.params.hashはトランザクションのハッシュではなく、Orderをkeccak256でハッシュしたもの
  let entity = Order.load(event.params.hash.toHex());
  if (!entity) {
    entity = new Order(event.params.hash.toHex());
  }

  // このExchangeCore Contractのaddress
  entity.contractAddress = event.params.exchange.toHex();
  // Orderを作成したEOA
  entity.makerAddress = event.params.maker.toHex();
  // Orderを受け入れたEOA
  entity.takerAddress = event.params.taker.toHex();
  // 対象となるNFT Contract Address
  entity.contractAddress = event.params.target.toHex();
  // Buy or Sell
  entity.saleSide = event.params.side;
  // FixedPrice or DutchAuction
  entity.saleKind = event.params.saleKind;

  entity.save();
}

// WyvernではOrder時のイベントのストレージサイズが制約に引っかかるため、2つに分けている
export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void {
  // event.params.hashはトランザクションのハッシュではなく、Orderをkeccak256でハッシュしたもの
  let entity = Order.load(event.params.hash.toHex());
  if (!entity) {
    entity = new Order(event.params.hash.toHex());
  }

  // 支払いに使われるERC20
  entity.paymentTokenAddress = event.params.paymentToken.toHex();
  // BasePrice
  entity.basePrice = event.params.basePrice;

  entity.save();
}

export function handleOrderCancelled(event: OrderCancelled): void {}

export function handleOrdersMatched(event: OrdersMatched): void {}

export function handleOwnershipRenounced(event: OwnershipRenounced): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
