// src/app/components/test/test.component.ts
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { Clientes } from '../interfaces/clientes';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.clienteService.getListCliente().subscribe(clientes => {
      console.log(clientes);
    });
  }
}
