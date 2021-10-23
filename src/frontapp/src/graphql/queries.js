/* eslint-disable */
// this is an auto generated file. This will be overwritten

/* 전시메인 조회 */
export const getListDisplayCornerTemplates = `query ListDisplayCornerTemplates {
  listDisplayCornerTemplates (filter:{
    displayTemplateNo: {eq: 1000}
  })
  {
    items{
      id
      cornerName
      cornerType
      cornerSetName
      cornerContents{
        items{
          id
          contentType
          contentName
          contentInfo
        }
      }
    }
  }
}
`;

/* 장바구니 id조회 */
export const getCartId = `query getMember($id:ID!) {
  getMember(id: $id) {
    cart{
      items{
        id
      }
    }
  }
}
`;

/* 회원정보 조회 */
export const getMember = `query getMember($id: ID!){
  getMember(id: $id) {
    id
    name
    destination
    email
    phoneNum
    point
    birthdate
    gender
  }
}
`;

/* 회원 장바구니 조회 */
export const getMemberCartItem = `query getMember($id: ID!){
  getMember(id: $id) {
    cart{
      items{
        id
        cartItems{
          items{
            id
            productImg
            productNo
            productName
            productType
            packageNo
            sellerId
            itemName
            itemPrice
            itemQty
            itemNo
            cartItemInfo
            createTime
          }
        }
      }
    }
  }
}
`;

/* 비회원 장바구니 조회 */
export const getSessionCartItem = `query getCart($id: ID!){
  getCart(id: $id) {
    cartItems{
      items{
        id
        productImg
        productNo
        productName
        productType
        packageNo
        sellerId
        itemName
        itemPrice
        itemQty
        itemNo
        cartItemInfo
      }
    }
  }
}
`;

/* 회원 장바구니의 주문요약 조회 */
export const getOrderSummary = `query getOrderSummary($id: ID!) {
  getCart(id: $id) {
    orderSummary
  }
}
`;

/* 회원 주문 조회 */
export const getOrder = `query getOrder($id: ID!) {
  getMember(id: $id) {
    orders {
      items {
        id
        createTime
        orderCartItemInfo
      }
    }
  }
}
`;

/* 회원 주문 조회 2 */
export const getOrderDetail = `query getOrder($id: ID!) {
  getOrder(id: $id) {
    totalQty
    totalPrice
    discountPrice
    deliveryReq
    payment
    createTime
    orderCartInfo
    orderCartItemInfo
    orderDeliveryInfo
  }
}
`;

/* 전시카테고리 조회 */
export const getDisplayCategoryList = `query getDisplayCategoryList {
  getDisplayCategoryList(
    sortDirection: ASC,
    displayCategoryType: CATEGORY
    ) 
    {
    items {
      id
      displayGroupCode                                                                  
      displayCategoryType                                                           
      displayCategoryLevel                                                      
      displayCategoryLeaf                                                                
      displayCategoryName                                                               
    }
  }
}
`;

/* 상품 조회 */
export const getProduct = `query getProduct($id: ID!) {
  getProduct(id: $id) {
    id
    productName
    productType
    productModelNo
    productStatus
    productImg
    originalPrice
    tenderPrice
    productItem {
      items {
        id
        itemName
        itemPrice
        itemInfo
      }
    }
  }
}
`;

  export const getProductItem = `query getProductItem($id: ID!) {
    getProductItem(id: $id) {
          id
          itemName
          itemPrice
          itemInfo
    }
  }`

  export const getDisplayCategory = `query getDisplayCategory($id: ID!) {
    getDisplayCategory(id: $id) {
      id
      displayGroupCode                                                                  
      displayCategoryType                                                           
      displayCategoryLevel                                                      
      displayCategoryLeaf                                                                
      displayCategoryName   
      displayProduct {
        items {
          id
          productNo
          productName
          productPrice
          displayStartPoint
          displayEndPoint
          displayInfo
        }
      }
    }
  }`