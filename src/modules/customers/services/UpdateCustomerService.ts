import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<User> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer Not Found');
    }

    const customerExist = await customersRepository.findByEmail(email);

    if (customerExist && email !== customer.email) {
      throw new AppError('Email already in use.');
    }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);
    return customer;
  }
}

export default UpdateCustomerService;
