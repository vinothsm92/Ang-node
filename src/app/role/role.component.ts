import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RoleService } from '../role/role.service';
import { MessageService } from 'primeng/components/common/messageservice';

export interface role {
  Role: String,
  Description: String,
  IsActive: Boolean
}
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})

export class RoleComponent implements OnInit {
  RoleForm: FormGroup;
  AddRolevisible: boolean = false;
  RoleMasters = [];
  cols: any[];
  brands: any[];
  rowData: any = {};
  UIListPopup: boolean = false;
  UIListPopupHeader: String;
  UIviews: any = {};
  RoleAlreadyPresent: boolean = false;
  ErrorCatch: boolean = false;
 
  constructor(private _http: HttpClient, private _router: Router, private _RoleService: RoleService, private _MessageService: MessageService) {

    this.RoleForm = new FormGroup({
      'Role': new FormControl('', Validators.required),
      'Description': new FormControl('', [Validators.required, Validators.maxLength(256)]),
      'IsActive': new FormControl('')
    });

  }
  ngOnInit() {

    this.cols = [
      { field: 'RoleName', header: 'Role Name' },
      { field: 'Description', header: 'Description' },
      { field: 'IsActive', header: 'IsActive?' }
    ];
    this.refresh();

  }

  onEdit(event) {
  }
  onEditComplete(event) {
  }

  onEditColumnInline(event, sd) {
    sd.DirtyFlag = true;
  }
  BulkUpdate(RoleData) {
    if (this.ErrorCatch) {
      return this._MessageService.add({ severity: 'error', summary: 'Error Message', detail: "Please Make sure Fill All Mandatory Fields" });
    } else {
      var GetDirtyFlagarrays = this.RoleMasters.filter(function (element) {
        return element.DirtyFlag == true;
      });
      if (GetDirtyFlagarrays.length > 0) {
        this._RoleService.RoleUpdate(GetDirtyFlagarrays).subscribe(data => {
          if (data == "Un-Authenticated") {
            this._router.navigate(['/']);
          } else {
            this._MessageService.add({ severity: 'success', summary: 'Success Message', detail: 'Role Updated Successfully' });
            this.ErrorCatch=false;
            this.refresh();
          }
        },
          error => {
            console.error(error)
            this._MessageService.add({ severity: 'error', summary: 'Error Message', detail: error });
          }
        );
      } else {
        this._MessageService.add({ severity: 'warn', summary: 'Warn Message', detail: 'No Changes Done' });
      }
    }

  }
  selectedUIListBasedRole(UniqueRoleData) {
    this.UIListPopupHeader = `Ui List - ${UniqueRoleData.RoleName}`
    this.UIListPopup = true;
    this.UIviews = UniqueRoleData;
  }
  saveUilist(data) {
    console.log(data);
  }

  GridCancel() {
    this.refresh();
  }

  DescisEmpty(input) {
    if (input.replace(/\s/g, '')) {
      this.ErrorCatch = false
    } else {
      this.ErrorCatch = true
      return input.replace(/\s/g, '') === "";
    }
  }
  RoleisEmpty(input) {
    if (input.replace(/\s/g, '')) {
      this.ErrorCatch = false
    } else {
      this.ErrorCatch = true
      return input.replace(/\s/g, '') === "";
    }
  }

  refresh() {
    this._RoleService.getRoledata().subscribe(data => {
      if (data == "Un-Authenticated") {
        this._router.navigate(['/']);
      } else {
        this.RoleMasters = data;
      }
    },
      error => {
        console.error(error)
        this._MessageService.add({ severity: 'error', summary: 'Error Message', detail: error });
      }
    );
  }


  ShowAddRole() {
    this.RoleForm.reset();
    this.AddRolevisible = true;
    this.RoleAlreadyPresent = false;
  }
  onAddRoleSubmit() {debugger
    if (this.RoleForm.valid) {
      this._RoleService.postRoledata(this.RoleForm.value).subscribe(data => {
        if (data == "Un-Authenticated") {
          this._router.navigate(['/']);
        }
        if (data == "Name Already Exists") {
          this.RoleAlreadyPresent = true;
        }
        else {
          this._MessageService.add({ severity: 'success', summary: 'Success Message', detail: 'Role Saved Successfully' });
          this.RoleForm.reset();
          this.refresh()
          this.AddRolevisible = false
        }
      },
        error => {
          console.error(error)
          this._MessageService.add({ severity: 'error', summary: 'Error Message', detail: error });
        }
      );
    } else {
      this.validateAllFields(this.RoleForm);
    }
  }


  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }


}
