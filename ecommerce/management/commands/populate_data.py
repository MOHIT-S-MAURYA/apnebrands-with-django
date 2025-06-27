from django.core.management.base import BaseCommand
from ecommerce.models import Category, Product, ProductVariant
from django.contrib.auth.models import User
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populate the database with sample data for apneBrands'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate database with sample data...'))
        
        # Create categories
        categories_data = [
            {
                'name': 'Handwoven Textiles',
                'description': 'Beautiful textiles woven by skilled artisans using traditional techniques'
            },
            {
                'name': 'Pottery & Ceramics',
                'description': 'Unique pottery and ceramic pieces crafted with ancient methods'
            },
            {
                'name': 'Jewelry & Accessories',
                'description': 'Handcrafted jewelry and accessories with cultural significance'
            },
            {
                'name': 'Wood Carvings',
                'description': 'Intricate wood carvings showcasing traditional artistry'
            },
            {
                'name': 'Metal Crafts',
                'description': 'Traditional metalwork including brass, copper, and silver items'
            },
            {
                'name': 'Baskets & Weavings',
                'description': 'Functional and decorative baskets woven from natural materials'
            }
        ]
        
        created_categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'slug': cat_data['name'].lower().replace(' ', '-').replace('&', 'and')
                }
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
            created_categories.append(category)
        
        # Create sample artisan users
        artisans_data = [
            {'username': 'maria_gonzalez', 'first_name': 'Maria', 'last_name': 'Gonzalez', 'email': 'maria@example.com'},
            {'username': 'john_smith', 'first_name': 'John', 'last_name': 'Smith', 'email': 'john@example.com'},
            {'username': 'priya_sharma', 'first_name': 'Priya', 'last_name': 'Sharma', 'email': 'priya@example.com'},
            {'username': 'carlos_rivera', 'first_name': 'Carlos', 'last_name': 'Rivera', 'email': 'carlos@example.com'},
        ]
        
        created_artisans = []
        for artisan_data in artisans_data:
            artisan, created = User.objects.get_or_create(
                username=artisan_data['username'],
                defaults={
                    'first_name': artisan_data['first_name'],
                    'last_name': artisan_data['last_name'],
                    'email': artisan_data['email']
                }
            )
            if created:
                artisan.set_password('password123')
                artisan.save()
                self.stdout.write(f'Created artisan: {artisan.get_full_name()}')
            created_artisans.append(artisan)
        
        # Create products
        products_data = [
            {
                'name': 'Traditional Ikat Scarf',
                'description': 'A beautiful handwoven scarf featuring traditional Ikat patterns. Made from 100% organic cotton using ancient dyeing techniques passed down through generations.',
                'category': 'Handwoven Textiles',
                'price': Decimal('45.00'),
                'stock_count': 25,
                'is_featured': True
            },
            {
                'name': 'Ceramic Water Jug',
                'description': 'Handcrafted ceramic water jug with intricate patterns. Perfect for keeping water cool and adding an artistic touch to your dining table.',
                'category': 'Pottery & Ceramics',
                'price': Decimal('35.00'),
                'stock_count': 15,
                'is_featured': True
            },
            {
                'name': 'Silver Tribal Necklace',
                'description': 'Authentic tribal necklace made from pure silver with traditional motifs. Each piece tells a story of cultural heritage.',
                'category': 'Jewelry & Accessories',
                'price': Decimal('120.00'),
                'stock_count': 8,
                'is_featured': True
            },
            {
                'name': 'Hand-carved Wooden Bowl',
                'description': 'Beautiful wooden bowl carved from sustainable wood. Perfect for serving or as a decorative piece.',
                'category': 'Wood Carvings',
                'price': Decimal('28.00'),
                'stock_count': 20,
                'is_featured': False
            },
            {
                'name': 'Copper Coffee Set',
                'description': 'Traditional copper coffee set including pot and cups. Handcrafted with intricate designs.',
                'category': 'Metal Crafts',
                'price': Decimal('85.00'),
                'stock_count': 12,
                'is_featured': False
            },
            {
                'name': 'Woven Storage Basket',
                'description': 'Large storage basket woven from natural fibers. Eco-friendly and durable.',
                'category': 'Baskets & Weavings',
                'price': Decimal('32.00'),
                'stock_count': 18,
                'is_featured': False
            },
            {
                'name': 'Indigo Dyed Table Runner',
                'description': 'Elegant table runner dyed with natural indigo. Adds a touch of tradition to modern dining.',
                'category': 'Handwoven Textiles',
                'price': Decimal('55.00'),
                'stock_count': 10,
                'is_featured': True
            },
            {
                'name': 'Clay Tea Set',
                'description': 'Complete tea set made from locally sourced clay. Includes teapot and four cups.',
                'category': 'Pottery & Ceramics',
                'price': Decimal('65.00'),
                'stock_count': 6,
                'is_featured': False
            }
        ]
        
        # Create products
        for product_data in products_data:
            try:
                category = Category.objects.get(name=product_data['category'])
                
                product, created = Product.objects.get_or_create(
                    name=product_data['name'],
                    defaults={
                        'description': product_data['description'],
                        'slug': product_data['name'].lower().replace(' ', '-').replace("'", ""),
                        'category': category,
                        'price': product_data['price'],
                        'stock_count': product_data['stock_count'],
                        'is_featured': product_data['is_featured'],
                        'short_description': product_data['description'][:250] + '...' if len(product_data['description']) > 250 else product_data['description'],
                        'availability': 'in_stock' if product_data['stock_count'] > 0 else 'out_of_stock'
                    }
                )
                
                if created:
                    self.stdout.write(f'Created product: {product.name}')
                    
                    # Create some variants for each product
                    if product.category.name == 'Handwoven Textiles':
                        variants = [
                            {'size': 'S', 'color': 'red', 'stock': 8},
                            {'size': 'M', 'color': 'blue', 'stock': 10},
                            {'size': 'L', 'color': 'green', 'stock': 7}
                        ]
                        for variant_data in variants:
                            ProductVariant.objects.get_or_create(
                                product=product,
                                size=variant_data['size'],
                                color=variant_data['color'],
                                defaults={
                                    'stock': variant_data['stock']
                                }
                            )
                    elif product.category.name == 'Jewelry & Accessories':
                        colors = [
                            {'size': 'M', 'color': 'white', 'stock': 3},
                            {'size': 'M', 'color': 'yellow', 'stock': 2},
                            {'size': 'M', 'color': 'brown', 'stock': 3}
                        ]
                        for color_data in colors:
                            ProductVariant.objects.get_or_create(
                                product=product,
                                size=color_data['size'],
                                color=color_data['color'],
                                defaults={
                                    'stock': color_data['stock']
                                }
                            )
                            
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating product {product_data["name"]}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data!'))
        self.stdout.write(f'Created {Category.objects.count()} categories')
        self.stdout.write(f'Created {Product.objects.count()} products')
        self.stdout.write(f'Created {ProductVariant.objects.count()} product variants')
        self.stdout.write(f'Total artisan users: {User.objects.filter(username__in=[a["username"] for a in artisans_data]).count()}')
