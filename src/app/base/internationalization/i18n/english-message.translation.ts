import { LanguageTypes } from '../../../base/default-language/language';

export class EnglishMessageDictionary {
  public static readonly language = LanguageTypes.english;
  public static readonly contents = {


    // Global Message
    '': 'undefined or missing code.',
    'basemaster.active.required': 'Active flag required!',
    'basemaster.orderNumber.required': 'Order Number required!',
    'client.nointernet.title': 'No internet connection',
    'client.nointernet.desc': 'You are not connected to the internet. Please try again.',
    'client.expired.title': 'Your session has expired',
    'client.expired.desc': 'Please re-login to renew your session',
    'data.require.id.and.version': 'Id and version of data is required for this action.',
    'data.require.id.version.and.root.version': 'Id, version, and rootVersion of data is required for this action.',
    'data.not.found': 'Data <b>{{0}}</b> with id <b>{{1}}</b> not found.',
    'data.obsolete.version': 'Cannot modify data due to incorrect version.',
    'data.order.undefinedID': 'Undefined data with ID : <b>{{0}}</b>',
    'data.order.undefinedIndex': '<b>{{0}}</b> not found in list',
    'data.orderChanged': 'Data order number has been changed!',
    'data.required': 'Field is required!',
    'data.min.length': 'Field min length is {{0}}',
    'data.max.length': 'Field max length is {{0}}',
    'data.invalid': 'Field is not an valid value!',
    'delete.data.integrity.violation': 'Delete failed! Data is still being referenced to another entity(s)',
    'email.reported': 'Email has been sent to the support team.',
    'excel.cell.required': 'Cell {{0}} required!',
    'excel.cell.min.length': 'Cell minimum length is {{0}}!',
    'excel.cell.max.length': 'Cell max length is: {{0}}.',
    'excel.cell.invalid': 'Cell is not valid',
    'notification.passed.hours': '{{0}} hours ago',
    'file.excel.unknown': 'Invalid excel file',
    'root.data.not.found': 'Root data <b>{{0}}</b> with id <b>{{1}}</b> not found.',
    'root.data.obsolete.version': 'Cannot modify data due to incorrect root version.',
    'upload.sheet.not.found': '"Upload" sheet was not found on the file, please re-download the template!',
    'upload.column.not.found': 'Column {{0}} was not found in the file, please re-download the template!',
    'upload.header.invalid': 'Invalid header, please re-download the template!',
    'upload.error': 'Upload error file on line {{0}}',
    'upload.success': '{{0}} data has been uploaded!',
    'upload.data.empty': 'Column {{0}} must not empty!',
    'multiupdate.error': 'Multi update error at line {{0}}',
    'multiupdate.success': '{{0}} data has been updated!',
    'no.data.selected': 'No data selected.',
    'no.new.data.selected': 'No new data selected.',
    'server.error.title': 'Server error',
    'server.error.desc': 'Please use the E-mail Report button to report errors to our support team.',


    // PASTE GL MESSAGE BELOW
    ArusKasCantBeDeleted: 'Cash Flow cannot be deleted',
    ArusKasExist: 'Cash Flow already exist',
    ArusKasNotExist: 'Cash Flow does not exist',
    ArusKasUsedInTransaksiJurnal: 'Cash Flow {{0}} is already used in Journal Transaction',
    CodeMustExist: '{{0}} code must exist',
    EditDeleteNotAllowed: 'Edit or Delete not Allowed {{0}}',
    EmailFormatIsNotValid: 'Email format is not valid',
    FieldMustNotBlank: 'Field {{0}} Must Not Blank !',
    KodeAccountExist: 'Account Code Already Exist !',
    KodeAccountMustNotBlank: 'Account Code Must Not Blank',
    KodeAccountNotExist: 'Account Code Not Exist !',
    KodeAccountParentNotExist: 'Parent Account Code Not Exist !',
    KodeArusKasMustNotBlank: 'Cah Flow Code Must Not Blank',
    MasterExist: 'Master {{0}} With Code {{1}} Already Exist !',
    MasterNotExist: 'Master {{0}} With Code {{1}} Not Exist !',
    NamaAccountMustNotBlank: 'Account Name Must Not Blank',
    NamaArusKasMustNotBlank: 'Cash Flow Name Must Not Blank',
    NameMustExist: '{{0}} name must exist',
    NoRightToAdd: 'Sorry, you have no right to add the record',
    NoRightToChange: 'Sorry, you have no right to change the record',
    NoRightToDelete: 'Sorry, you have no right to delete the record',
    NoRightToView: 'Sorry, you have no right to see the data',
    TemplateJurnalCantBeDeleted: 'Journal Template cannot be deleted',
    TemplateJurnalDetailExist: 'Journal Template Detail already exist',
    TemplateJurnalDetailNotExist: 'Journal Template Detail does not exist',
    TemplateJurnalExist: 'Journal Template already exist',
    TemplateJurnalNotExist: 'Journal Template does not exist',
    ValutaHasBeenUsedOnJournalTransactions: 'Valuta has been used on journal transactions',
    VersionError: 'Displayed Data Version is different from Database Version',

    errrrorrr: 'test multi error eng {{0}}',
    error: 'asdasd {{0}} haha ENGLISH',
    error2: 'testasd {{0}} test {{1}} bubu ENGLISH',
    var: '{{0}}',
    AccessRightsNotFound: 'Access rights not found',
    MenuNotFound: 'Menu not found',

    'aruskas.bk': 'Cash Flow with ID {0} already exists',
    'aruskas.kode.max.length': 'Cash Flow Code overflow',
    'aruskas.kode.required': 'Cash Flow Code is required',
    'aruskas.nama.max.length': 'Cash Flow Name overflow',
    'aruskas.nama.required': 'Cash Flow Name is required',
    'aruskas.not.active': 'Cash Flow not active',
    'aruskas.not.found': 'Cash Flow not found',

    'coa.not.active': 'COA not active',
    'coa.not.found': 'COA not found',
    'coasubperkiraan.not.found': 'COA for sub account not found',
    'detiltransaksijurnal.bk': 'Journal detail with ID {0} already exists',
    'detiltransaksijurnal.coa.required': 'COA is required',
    'detiltransaksijurnal.debet.max.length': 'Debit value overflow',
    'detiltransaksijurnal.debet.min.length': 'Debit value less than required',
    'detiltransaksijurnal.debetkredit.required': 'Debit/Credit must be filled',
    'detiltransaksijurnal.kredit.max.length': 'Credit value overflow',
    'detiltransaksijurnal.kredit.min.length': 'Credit value less than required',
    'lampirantransaksijurnal.bk': 'Attachment filename {0} already exists',
    'lampirantransaksijurnal.file.required': 'Attachment file required',
    'lampirantransaksijurnal.fileextension.required': 'Attachment Extension required',
    'lampirantransaksijurnal.filename.required': 'File name required',
    'subdetiltransaksijurnal.bk': 'Sub account type {0} with code {1} already exists',
    'subdetiltransaksijurnal.coajenissubperkiraan.required': 'Sub account type for this COA must exists',
    'subdetiltransaksijurnal.subperkiraan.required': 'Sub account must exists',
    'subperkiraan.not.active' : 'Sub account not active',
    'subperkiraan.not.found': 'Sub account not found',
    'transaksijurnal.bk': 'Journal number {0} already exists',
    'transaksiJurnal.error.in.detailJurnal': 'Error found in journal detail',
    'transaksiJurnal.error.in.detailLampiran': 'Error found in journal attachment',
    'transaksiJurnal.error.in.subdetailperkiraan': 'Error found in journal sub account',
    'transaksijurnal.keterangan.max.length': 'Description overflow',
    'transaksijurnal.kurs.max.length': 'Kurs value overflow',
    'transaksijurnal.kurs.min.length': 'Kurs value less than required',
    'transaksijurnal.nilaireferensi.max.length': 'Reference value overflow',
    'transaksijurnal.nilaireferensi.min.length': 'Reference value less than required',
    'transaksijurnal.nojurnal.required': 'Journal number must be filled',
    'transaksijurnal.noreferensi.max.length': 'Reference number overflow',
    'transaksijurnal.tanggaljurnal.required': 'Journal date must be filled',
    'transaksiJurnalDetail.aruskas.not.found': 'Cash floe not found',
    'transaksiJurnalDetail.coa.not.found': 'COA not found',
    'transaksiJurnalDetail.subdetail.failed': 'Failure found in sub account',
    'transaksiJurnalHeader.no.data': 'Data not found',
    'transaksiJurnalHeader.no.detailJurnal': 'Journal detail not found',
    'transaksiJurnalSubDetail.coaJenisSubPerkiraan.not.found': 'Sub account type not found',
    'transaksiJurnalSubDetail.subPerkiraan.not.found': 'Sub account not found',
    'valuta.not.active': 'Currency not active',
    'valuta.not.found': 'Currency not found',

    'bisnisPartner.not.active' : 'Mitra Bisnis not active',
    'bisnisPartner.not.found' : 'Mitra Bisnis not found',
    'detilkegopstransaksipenerimaankasbank.bk': 'Operational activity with id {0} already exists',
    'detilreftransaksipenerimaankasbank.bk': 'Reference document with id {0} already exists',
    'detilreftransaksipenerimaankasbank.nilai.max.length': 'Reference document value overflow',
    'detilreftransaksipenerimaankasbank.nilai.min.length': 'Reference document value less than required',
    'detilreftransaksipenerimaankasbank.nilai.required': 'Reference document value must be filled',
    'detilreftransaksipenerimaankasbank.refdok.max.length': 'Reference document number overflow',
    'detilreftransaksipenerimaankasbank.refdok.required': 'Reference document number mus be filled',
    'kasbank.not.active': 'Kas/Bank not active',
    'kasbank.not.found': 'Kas/Bank not found',
    'kegiatanOperasional.not.active': 'Kegiatan operasional not active',
    'kegiatanOperasional.not.found': 'Kegiatan operasional not found',
    'transaksipenerimaankasbank.bisnispartner.required': 'Business partner must be filled',
    'transaksipenerimaankasbank.bk': 'Cash/Bank receipt transaction with id {0} already exists', 
    'transaksiPenerimaanKasBank.error.in.detailKegiatanOperasional': 'Error found in operational activity detail',
    'transaksiPenerimaanKasBank.error.in.detailReferensi': 'Error found in reference document detail',
    'transaksipenerimaankasbank.jenistransaksi.max.length': 'Transaction type overflow',
    'transaksipenerimaankasbank.jenistransaksi.required': 'Transaction type must be filled',
    'transaksipenerimaankasbank.kasbank.required': 'Cash/Bank must be filled',
    'transaksipenerimaankasbank.keterangan.max.length': 'Description overflow',
    'transaksipenerimaankasbank.kurs.max.length': 'Currency exchange rate overflow',
    'transaksipenerimaankasbank.kurs.min.length': 'Currency exchange rate less than required',
    'transaksipenerimaankasbank.namabank.max.length': 'Bank name overflow',
    'transaksiPenerimaanKasBank.no.data': 'Cash/Bank receipt transaction has no data',
    'transaksiPenerimaanKasBank.no.detailKegiatanOperasional': 'Operational activity detail not found',
    'transaksiPenerimaanKasBank.no.detailReferensi': 'Reference document detail not found',
    'transaksipenerimaankasbank.nobukti.max.length': 'Receipt number overflow',
    'transaksipenerimaankasbank.norek.max.length': 'Bank account overflow',
    'transaksipenerimaankasbank.notransaksi.max.length': 'Transaction number overflow',
    'transaksipenerimaankasbank.notransaksi.required': 'Transaction number must be filled',
    'transaksipenerimaankasbank.tanggaltransaksi.max.length': 'Transaction date overflow',
    'transaksipenerimaankasbank.tanggaltransaksi.required': 'Transaction date must be filled',
    'transaksipenerimaankasbank.totalnilai.max.length': 'Total value overflow',
    'transaksipenerimaankasbank.totalnilai.min.length': 'Total value less than required',
    'transaksipenerimaankasbank.valuta.required': 'Currency must be filled',

    // error terkait laporan 
    'rpt.prs.tb.kw.001': 'Previous month not processed',
    'rpt.prs.tb.kw.002': 'Previous month not processed',

    'error.rpt.labarugi.fe.0001': 'Start date ({{0}}) must less than end date ({{1}})',
    'error.rpt.perubahanmodal.fe.0001': 'Start date ({{0}}) must less than end date ({{1}})',
    'error.rpt.aruskas.fe.0001': 'Start date ({{0}}) must less than end date ({{1}})',
    'error.rpt.neracapercobaan.fe.0001': 'Start date ({{0}}) must less than end date ({{1}})',
    'error.rpt.bukubesar.fe.0001': 'Start date ({{0}}) must less than end date ({{1}})',

    // error (FE) terkait transaksi jurnal
    'error.trx.jurnal.fe.debet.harus.diisi': 'Debit value is empty',
    'error.trx.jurnal.fe.kredit.harus.diisi': 'Kredit value is empty',
    'error.trx.jurnal.fe.debet.kredit.harus.sama': 'Debit and Kredit not balanced',

    // error (FE) terkait jadwal perulangan
    'error.jadwal.perulangan.fe.debet.harus.diisi': 'Debit value is empty',
    'error.jadwal.perulangan.fe.kredit.harus.diisi': 'Kredit value is empty',
    'error.jadwal.perulangan.fe.debet.kredit.harus.sama': 'Debit and Kredit not balanced',
    'error.jadwal.perulangan.fe.tglawal.kurang.tglakhir': 'Start date ({{0}}) must less than end date ({{1}})',

    // error (FE) terkait template jurnal
    'error.template.jurnal.fe.debet.kredit.harus.ada': 'There must be at least one Debit and one Credit chosen',

    // proses bulanan
    'prosesBulanan.sp.01': 'Monthly process for month {{0}} already processed !',
    'prosesBulanan.sp.02': 'Monthly process for month {{0}} succeeded',
    'prosesBulanan.sp.03': 'Un-confirmed journal still exists for month {{0}}',
    'error.prosesbulanan.fe.0001': 'Not balanced routine journal found !',
    'batalProsesBulanan.sp.01': 'Monthly proccess cancelation for month {{0}} failed !',
    'batalProsesBulanan.sp.02': 'Monthly process for month {{0}} not available',

    // error untuk input di grid
    'InputBelumLengkap': 'Mandatory input not complete',

    // untuk test error di notifikasi
    'cobaError.03': 'ini error percobaan ({{1}})',

    // master sub perkiraan
    'subperkiraan.kode.max.length': 'Sub account code length overflow',
    'subperkiraan.keterangan.max.length': 'Sub account description overflow',

    // master jenis sub perkiraan
    'jenisSubPerkiraan.error.in.detailSubPerkiraan': 'Error in sub account details',

    // detil error di notifikasi
    'process.error.unknow': 'unknown error : {{0}}',

    // confirm message
    'confirm.jadwalPerulangan.terminate': 'Terminate recurring schedule ({{0}}) ?',

    // error dari upload jenis sub perkiraan
    'upload.jenis.subperkiraan.be.error.01': 'coba 1 {{0}} ',
    'upload.jenis.subperkiraan.be.error.02': 'coba 2 {{0}} ',
    'upload.jenis.subperkiraan.be.error.03': 'coba 3 {{0}} ',

    // INVOICING GAJI.ID
    'invoicemanual.komplit.error.in.detail': 'Error occured in detail',
    'invoicemanual.detail.lainlain.keterangan.required': 'Description must be filled!',
    'invoicemanual.komplit.saldodeposit.tidak.cukup': 'Insufficient Deposit',

    'error.customer.tarif.produk.detail.fe.0001': 'This Product not live yet, same rates tipe not allowed twice',
    'error.customer.tarif.produk.detail.fe.0002': 'Previous data for this rates tipe, having open stop date',
    'error.customer.tarif.produk.detail.fe.0003': 'Start date overlap with end date of previous data',
    'error.customer.tarif.produk.detail.fe.0004': 'Start date overlap with start date of previous data',
    'error.customer.tarif.produk.detail.fe.0005': 'Start date could not younger than last period',

    'error.customer.fe.0001': 'Bill To, can not filled both to self and to third party',

    'error.could.not.send.email': 'Sending email to {{0}} failed!',
    'error.access.external.api.failed': 'Accessing external API failed!',

    'CustomerSudahAda': 'Customer already exists',

};

  public static getValues() {
    return {
      language: EnglishMessageDictionary.language,
      contents: EnglishMessageDictionary.contents
    };
  }
}
