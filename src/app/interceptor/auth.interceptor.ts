import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor: Request is on its way:', req);

  return next(req).pipe(
    tap(
      event => {
        if (event instanceof HttpResponse) {
          console.log('Interceptor: Response received:', event);
        }
      },
      error => {
        console.error('Interceptor: Error occurred:', error);
      }
    )
  );
};
