/* eslint-disable */
// this is an auto generated file. This will be overwritten

//장바구니 생성
export const createCart = /* GraphQL */ `
  mutation CreateCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    createCart(input: $input, condition: $condition) {
      id
      cartType
      cartName
    }
  }
`;

//장바구니 아이템 생성
export const createCartItem = /* GraphQL */ `
  mutation CreateCartItem(
    $input: CreateCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    createCartItem(input: $input, condition: $condition) {
      id
      productImg
      productNo
      itemNo
      productType
      packageNo
      sellerId
      productName
      itemName
      itemPrice
      itemQty
      cartItemInfo
    }
  }
`;

//장바구니 상품업데이트
export const updateCartItem = /* GraphQL */ `
  mutation UpdateCartItem(
    $input: UpdateCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    updateCartItem(input: $input, condition: $condition) {
      id
      productImg
      productNo
      itemNo
      productType
      packageNo
      sellerId
      productName
      itemName
      itemPrice
      itemQty
      cartItemInfo
    }
  }
`;

//장바구니 상품삭제
export const deleteCartItem = /* GraphQL */ `
  mutation DeleteCartItem(
    $input: DeleteCartItemInput!
    $condition: ModelCartItemConditionInput
  ) {
    deleteCartItem(input: $input, condition: $condition) {
      id
      productImg
      productNo
      itemNo
      productType
      packageNo
      sellerId
      productName
      itemName
      itemPrice
      itemQty
      cartItemInfo
    }
  }
`;

//장바구니 삭제
export const deleteCart = /* GraphQL */ `
  mutation DeleteCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    deleteCart(input: $input, condition: $condition) {
      id
    }
  }
`;

//비회원 회원가입 후 세션카트에서 멤버카트로 업데이트
export const UpdateCart = /* GraphQL */ `
  mutation UpdateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
      id
      cartType
      cartName
      cartItems {
        items {
          id
          productImg
          productNo
          productType
          packageNo
          sellerId
          productName
          itemNo
          itemName
          itemPrice
          itemQty
          cartItemInfo
        }
      }
    }
  }
`;

// 회원 배송지 업데이트
export const updateMemberDestination = /* GraphQL */ `
  mutation updateMember(
    $input: UpdateMemberInput!
    $condition: ModelMemberConditionInput
    ) {
      updateMember(input: $input, condition: $condition) {
        id
        destination
      }
    }
`;

//회원 주문서 생성
export const createOrder = /* GraphQL */ `
  mutation createOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      totalQty
      totalPrice
      discountPrice
      deliveryReq
      payment
      createTime
      orderCartItemInfo
      orderCartInfo
      orderDeliveryInfo
    }
  }
`;

//회원 포인트 업데이트
export const updateMemberPoint = /* GraphQL */ `
  mutation updateMember(
    $input: UpdateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    updateMember(input: $input, condition: $condition) {
      id
      point
    }
  }
`;

//장바구니의 Order Summary 업데이트
export const updateOrderSummary = /* GraphQL */ `
  mutation updateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
      id
      orderSummary
    }
  }
`;