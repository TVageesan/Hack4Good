import { useState, useEffect } from "react";
import { getUser, getUserVouchers , getAllProducts } from "../../backend/database";
import { User, Voucher, Product } from "../../types";
import { Container, Box } from "@mantine/core";
import { ProfileCard } from "../../components/userComponents/accountComponents/ProfileCard";
import { VoucherFilter } from "../../components/userComponents/accountComponents/VoucherFilter";
import { VoucherCard } from "../../components/userComponents/accountComponents/VoucherCard";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedUser] = await getUser();
      setUser(fetchedUser);

      const allVouchers = await getUserVouchers();
      setVouchers(allVouchers.sort((a, b) => b.created_at - a.created_at));

      const allProducts = await getAllProducts();
      setProducts(allProducts);
    };

    fetchData();
  }, []);

  const filteredVouchers = vouchers.filter((voucher) => {
    if (filter === "CLAIMED") return voucher.claimed_on != null;
    if (filter === "VALID") return voucher.claimed_on == null;
    return true;
  });

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Container size="sm" mt="lg">
      <Box mb="lg">
        <ProfileCard user={user} />
      </Box>

      <Box>
        <VoucherFilter filter={filter} setFilter={setFilter} />

        <Box mt="lg">
          {filteredVouchers.map((voucher) => {
            const product = products.find(
              (prod) => prod.id === (voucher.product_id)      
            );
            return (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                product={product}
              />
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}
