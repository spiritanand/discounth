import { products } from "~/lib/data/products";
import { ProductCard } from "~/components/product-card";
import { CartButton } from "~/components/cart-button";

export default function HomePage() {
	return (
		<main className="container mx-auto py-8">
			<div className="mb-8 flex justify-end">
				<CartButton />
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</main>
	);
}
