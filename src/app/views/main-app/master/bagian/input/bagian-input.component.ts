import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { SessionHelper } from 'src/app/helper/session-helper';
import { LZStringService } from 'ng-lz-string';
import { MasterBagian } from 'src/app/pg-resource/master/bagian/model/bagian.model';
import { MasterBagianService } from 'src/app/pg-resource/master/bagian/bagian.service';

@Component({
  selector: 'app-bagian-input',
  templateUrl: './bagian-input.component.html',
  styleUrls: ['./bagian-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BagianInputComponent implements OnInit, OnDestroy, AfterViewChecked {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'MasterBagian';
  public inputForm: FormGroup;
  public radioButtonAktif: any[];
  public mode: string;
  public selectedData: MasterBagian = null;
  public isViewOnly = false;
  public previousUrl = '';

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    private bagianService: MasterBagianService,
    private route: ActivatedRoute,
    private router: Router,
    private breadCrumbService: BreadCrumbService,
    public defaultLanguageState: DefaultLanguageState,
    private cdRef: ChangeDetectorRef,
    private feComboConstantService: FEComboConstantService,
    private lzStringService: LZStringService
  ) {}

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
    this.initInputForm();
    this.initRadioButtonAktif();
    this.dataBridging();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  private initInputForm() {
    this.inputForm = this.fb.group({
      kodeBagian: [{ value: '', disabled: this.isViewOnly }, [Validators.required, Validators.maxLength(10)]],
      namaBagian: [{ value: '', disabled: this.isViewOnly }, [Validators.required, Validators.maxLength(100)]],
      aktif: [{ value: '', disabled: this.isViewOnly }]
    });
  }

  public initRadioButtonAktif() {
    this.uiBlockService.showUiBlock();
    this.feComboConstantService
      .getAktifNonAktif()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();
          this.radioButtonAktif = result.data.map(
            item => new Object({ name: item.deskripsi, key: item.kode })
          );
          this.inputForm.controls.aktif.patchValue(this.radioButtonAktif[0].key);
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  private dataBridging() {
    const sessionData = SessionHelper.getItem('MBAGIAN-H', this.lzStringService);
    this.previousUrl = sessionData.urlAsal;

    if (sessionData.mode === 'edit' || sessionData.mode === 'view') {
      this.selectedData = sessionData.data;
      this.mode = sessionData.mode;
      this.isViewOnly = this.mode === 'view';
      this.initInputForm();
      this.patchValue();

      if (this.mode === 'edit') {
        this.inputForm.controls.kodeBagian.disable();
      }
    } else {
      this.selectedData = sessionData.data;
      this.mode = 'add';
      this.isViewOnly = false;
      this.initInputForm();
    }
  }

  private patchValue() {
    if (this.selectedData) {
      this.inputForm.patchValue({
        kodeBagian: (this.selectedData.kodeBagian === null ? '' : this.selectedData.kodeBagian),
        namaBagian: (this.selectedData.namaBagian === null ? '' : this.selectedData.namaBagian),
        aktif: (this.selectedData.aktif === null ? '' : this.selectedData.aktif)
      });
    }
  }

  private fillModel() {
    this.selectedData.kodeBagian = this.inputForm.controls.kodeBagian.value;
    this.selectedData.namaBagian = this.inputForm.controls.namaBagian.value;
    this.selectedData.aktif = this.inputForm.controls.aktif.value;
  }

  public Save() {
    if (this.mode === 'add') {
      this.doSaveSave();
    } else {
      this.doEditSave();
    }
  }

  public doSaveSave() { 
    this.uiBlockService.showUiBlock();
    this.fillModel();

    this.bagianService
      .add(this.selectedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();
          this.translateService.get('TambahBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            });
          this.back();
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public doEditSave() {
    this.uiBlockService.showUiBlock();
    this.fillModel();

    this.bagianService
      .edit(this.selectedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();
          this.translateService.get('EditBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            });
          this.back();
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public back() {
    const sessionData = SessionHelper.getItem('MBAGIAN-BROWSE-SCR', this.lzStringService);
    sessionData.fromDetail = true;
    SessionHelper.setItem('MBAGIAN-BROWSE-SCR', sessionData, this.lzStringService);
    this.router.navigate([this.previousUrl]);
  }
}
