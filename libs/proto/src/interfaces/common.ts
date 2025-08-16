// Common gRPC interfaces and types

export interface GrpcServiceDefinition {
  name: string;
  package: string;
  methods: GrpcMethodDefinition[];
}

export interface GrpcMethodDefinition {
  name: string;
  requestType: string;
  responseType: string;
  requestStream?: boolean;
  responseStream?: boolean;
}

export interface BaseGrpcResponse {
  success: boolean;
  message?: string;
}
