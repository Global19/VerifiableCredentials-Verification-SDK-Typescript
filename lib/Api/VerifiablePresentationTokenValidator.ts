/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TokenType, IExpected, ITokenValidator, ClaimToken } from '../index';
import { IValidationResponse } from '../InputValidation/IValidationResponse';
import ValidationOptions from '../Options/ValidationOptions';
import { VerifiablePresentationValidation } from '../InputValidation/VerifiablePresentationValidation';
import IValidatorOptions from '../Options/IValidatorOptions';
import { VerifiableCredentialValidation } from '../InputValidation/VerifiableCredentialValidation';
import { IdTokenValidation } from '../InputValidation/IdTokenValidation';
import { IValidationOptions } from '../Options/IValidationOptions';
import ValidationQueue from '../InputValidation/ValidationQueue';
import ValidationQueueItem from '../InputValidation/ValidationQueueItem';

/**
 * Class to validate a token
 */
export default class VerifiablePresentationTokenValidator implements ITokenValidator {

  /**
   * Create new instance of <see @class VerifiablePresentationTokenValidator>
   * @param validatorOption The options used during validation
   * @param expected values to find in the token to validate
   */
  constructor (private validatorOption: IValidatorOptions, private expected: IExpected) {
  }

  /**
   * Validate the token
   * @param queue with tokens to validate
   * @param queueItem under validation
   * @param siopDid needs to be equal to audience of VP
   */
  public async validate(queue: ValidationQueue, queueItem: ValidationQueueItem, siopDid: string): Promise<IValidationResponse> { 
    const options = new ValidationOptions(this.validatorOption, TokenType.verifiablePresentation);
    const validator = new VerifiablePresentationValidation(options, this.expected, siopDid);
    const validationResult = await validator.validate(queueItem.tokenToValidate);

    if (validationResult.tokensToValidate) {
      for (let inx=0; inx < validationResult.tokensToValidate.length; inx++) {
        queue.addToken(validationResult.tokensToValidate[inx]);
      }
    }
    return validationResult;
  }
  
  /**
   * Gets the type of token to validate
   */
  public get isType(): TokenType {
    return TokenType.verifiablePresentation;
  }
}

