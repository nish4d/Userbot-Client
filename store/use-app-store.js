"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = void 0;
const zustand_1 = require("zustand");
const api_client_1 = require("@/services/api-client");
const health_service_1 = require("@/services/health.service");
exports.useAppStore = (0, zustand_1.create)((set) => ({
    // Health Status
    health: null,
    isHealthLoading: false,
    healthError: null,
    checkHealth: () => __awaiter(void 0, void 0, void 0, function* () {
        set({ isHealthLoading: true });
        try {
            const health = yield health_service_1.healthService.checkHealth();
            set({ health, healthError: null });
        }
        catch (error) {
            set({
                healthError: error instanceof Error ? error.message : "Failed to check health",
                health: null,
            });
        }
        finally {
            set({ isHealthLoading: false });
        }
    }),
    // App State
    isInitialized: false,
    initialize: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, api_client_1.initializeApiClient)();
            set({ isInitialized: true });
            // Perform initial health check
            yield health_service_1.healthService.checkHealth();
        }
        catch (error) {
            console.error("[App] Failed to initialize app:", error);
        }
    }),
}));
