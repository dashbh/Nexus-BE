// Authentication Service Definition
import { GrpcServiceDefinition } from '../interfaces/common';

export const AUTH_SERVICE: GrpcServiceDefinition = {
  name: 'AuthService',
  package: 'nexus.auth',
  methods: [
    {
      name: 'ValidateUser',
      requestType: 'ValidateUserRequest',
      responseType: 'ValidateUserResponse',
    },
    {
      name: 'CreateUser',
      requestType: 'CreateUserRequest',
      responseType: 'CreateUserResponse',
    },
    {
      name: 'GetUser',
      requestType: 'GetUserRequest',
      responseType: 'GetUserResponse',
    },
  ],
};
