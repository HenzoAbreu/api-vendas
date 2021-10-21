import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const productExists = await productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('Product name already exists');
    }

    const redisCache = new RedisCache();

    const products = productsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-vends-PRODUCT_LIST');

    await productsRepository.save(products);

    return products;
  }
}

export default CreateProductService;
