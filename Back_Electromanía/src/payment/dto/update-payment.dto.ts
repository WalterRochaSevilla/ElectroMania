import { take } from "rxjs";
import { PaymentStatus, RegisterPaymentDto } from "./register-payment.dto";

export class UpdatePaymentDto{
  id: number
  status: PaymentStatus
}