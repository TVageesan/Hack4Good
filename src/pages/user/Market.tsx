import { useState } from 'react';
import { Container, Grid, Modal, Image, Text, Button, Notification} from '@mantine/core';
import { ProductCard } from '../../components/ProductCard';
import { SearchNav } from '../../components/SearchNav';
import { RecommendedFilters } from '../../components/RecommendedFilters';
import { Product } from '../../types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../actions/cartActions';

import { getAllProducts } from "../../db/database";
// You'll want to move this to a separate file or fetch from an API

export default function Market() {
  const [products, setProducts] = useState<Product[]>([]);
  getAllProducts().then((products) => setProducts(products));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

    const closeModal = () => {
      setSelectedProduct(null);
      setIsModalOpen(false);
    };

    const handleAddToCart = (product: Product) => {
      dispatch(addToCart(product));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  

  return (
    <Container size="xl" py="xl">
      <SearchNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <RecommendedFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <Grid mt="xl">
        {filteredProducts.length == 0 ? (
          <Text>No products found matching your criteria.</Text>
        ) : (
          filteredProducts.map((product) => (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard
                product={product}
                onClick={() => openModal(product)}
              />
            </Grid.Col>
          ))
        )}
      </Grid>

        {/* Modal for Product Details */}
      <Modal
        opened={isModalOpen}
        onClose={closeModal}
        title={selectedProduct?.name}
      >
        {selectedProduct && (
          <div>
            <Image src={selectedProduct.img} alt={selectedProduct.name} />
            <Text mt="sm" size="md">
              Catergory: {selectedProduct.category}
            </Text>
            <Button mt="lg" onClick={closeModal}>
              Close
            </Button>
          </div>
        )}
      </Modal>

        {/* Cart Added Notification */}
      {showNotification && (
        <Notification
          title="Added to Cart"
          color="teal"
          onClose={() => setShowNotification(false)}
        >
          {selectedProduct?.name} has been added to your cart.
        </Notification>
      )}
    </Container> 
    );
  }
