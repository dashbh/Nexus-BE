// Financial Data Service Definition
import { GrpcServiceDefinition } from '../interfaces/common';

export const FINDATA_SERVICE: GrpcServiceDefinition = {
  name: 'FinDataService',
  package: 'nexus.findata',
  methods: [
    {
      name: 'GetPriceHistory',
      requestType: 'GetPriceHistoryRequest',
      responseType: 'GetPriceHistoryResponse',
    },
  ],
};
