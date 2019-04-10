import { InjectionToken } from '@angular/core';
import { AbTestOptions } from './module';

export const CONFIG = new InjectionToken<AbTestOptions[]>('ANGULAR_AB_TEST_CONFIG');
