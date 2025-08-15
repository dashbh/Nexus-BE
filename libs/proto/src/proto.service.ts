import { Injectable } from '@nestjs/common';
import { GrpcServiceDefinition } from './interfaces/common';
import { GRPC_SERVICES, GrpcServiceName } from './constants/grpc-services';
import { KAFKA_TOPICS, KafkaTopicName } from './constants/kafka-topics';
import {
  validateGrpcRequest,
  createGrpcErrorResponse,
  createGrpcSuccessResponse,
} from './utils/grpc-helpers';

@Injectable()
export class ProtoService {
  /**
   * Gets service definition by name
   */
  getServiceDefinition(serviceName: GrpcServiceName): GrpcServiceDefinition {
    const service = GRPC_SERVICES[serviceName];
    return {
      ...service,
      methods: service.methods.slice(),
    };
  }

  /**
   * Gets all available services
   */
  getAllServices(): GrpcServiceDefinition[] {
    return Object.values(GRPC_SERVICES).map((service) => ({
      ...service,
      methods: service.methods.slice(),
    }));
  }

  /**
   * Gets Kafka topic by name
   */
  getKafkaTopic(topicName: KafkaTopicName): string {
    return KAFKA_TOPICS[topicName];
  }

  /**
   * Gets all Kafka topics
   */
  getAllKafkaTopics(): string[] {
    return Object.values(KAFKA_TOPICS);
  }

  /**
   * Validates gRPC request structure
   */
  validateGrpcRequest(
    serviceName: string,
    methodName: string,
    request: unknown,
  ): boolean {
    return validateGrpcRequest(serviceName, methodName, request);
  }

  /**
   * Creates a standardized gRPC error response
   */
  createGrpcErrorResponse(message: string): {
    success: boolean;
    message: string;
  } {
    return createGrpcErrorResponse(message);
  }

  /**
   * Creates a standardized gRPC success response
   */
  createGrpcSuccessResponse<T extends Record<string, unknown>>(
    data?: T,
  ): { success: boolean } & T {
    return createGrpcSuccessResponse(data);
  }
}
