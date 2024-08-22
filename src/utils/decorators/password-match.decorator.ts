import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isMatching', async: false })
export class IsMatchingConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints; // 첫 번째 매개변수로 받는 필드명
    const relatedValue = (args.object as any)[relatedPropertyName]; // 동적으로 필드값을 가져옴
    if (!value) {
      return false; // 값이 비어있을 경우 검증 실패
    }
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints; // 첫 번째 매개변수로 받는 필드명
    const { value } = args;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!value) {
      return `${relatedPropertyName} 값을 입력해주세요.`; // 값이 비어있을 경우 메시지
    }
    return `${relatedPropertyName} 값과 일치하지 않습니다.`; // 값이 일치하지 않을 경우 메시지
  }
}
