import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsBySeller, getShopOverview } from "../../utils/axios/shop";
import ProductItem from "../../components/products/ProductItem";

const ShopManageHome = () => {
  const { id: shopId } = useParams();

  const [shopOverviewData, setShopOverviewData] = useState({
    shopProductCount: 0,
    shopOrderCount: 0,
    shopTotalRevenue: 0,
  });
  const [products, setProducts] = useState([]);

  //해당 가게의 overview정보를 가져옴
  useEffect(() => {
    console.log(shopId);
    const fetchShopOverview = async () => {
      const shopOverviewData = await getShopOverview();
      setShopOverviewData(shopOverviewData);
      console.log(shopOverviewData);
    };

    fetchShopOverview();
  }, [shopId]);

  //해당 가게에 등록된 모든 상품 정보를 가져옴
  useEffect(() => {
    const fetchShopProducts = async () => {
      const shopProducts = await getProductsBySeller(shopId);
      setProducts(shopProducts);
      console.log(shopProducts);
    };

    fetchShopProducts();
  }, [shopId]);

  return (
    <div className="w-full h-full p-5">
      <p className="text-center text-3xl font-bold p-5">가게 통합관리 플랫폼</p>
      <div className="flex gap-16 justify-center items-center p-5 border rounded-lg">
        <p>등록된 상품수: {shopOverviewData.shopProductCount}</p>
        <p>누적 주문건수: {shopOverviewData.shopOrderCount}</p>
        <p>
          누적 판매수익:{" "}
          {shopOverviewData.shopTotalRevenue.toLocaleString("ko-kr")}원
        </p>
      </div>
      {/* 에러 또는 상품이 없는 경우 */}
      <div className="m-10">
        {products?.length === 0 ||
          products === null ||
          (products === undefined && (
            <div className="flex justify-center items-center text-center text-2xl font-bold w-full">
              등록된 상품이 없거나 상품정보를 불러오는데 실패했어요.
            </div>
          ))}
      </div>

      <div
        className="p-4 grid gap-4 
      grid-cols-1       
      sm:grid-cols-2     
      md:grid-cols-3   
      "
      >
        {/* //FIXME: products가 undefined임 */}

        {products?.map((p, idx) => (
          <ProductItem
            name={p.name}
            price={p.price}
            image={p.image}
            category={p.category}
            stock={p.stock}
            id={p._id}
            key={idx}
          />
        ))}
        {/* //TODO: 상품 추가하는 기능 추가 */}
      </div>
    </div>
  );
};

export default ShopManageHome;
