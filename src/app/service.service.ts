import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Bill, } from './data-model';
import { Platform, ToastController, LoadingController } from '@ionic/angular';

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public file: File, public fileOpener: FileOpener,
    private toastController: ToastController, public plt: Platform,
    public loadingCtrl: LoadingController) { }

  async presentToast(message: string, time: number = 1500) {
    const toast = await this.toastController.create({
      message: message,
      duration: time
    });
    toast.present();
  }

  async makePdf(bill: Bill) {

    let billBody: any[] = [];

    const loader = await this.loadingCtrl.create({
      message: 'Bill is getting generated...'
    });
    loader.present();
    pdfmake.vfs = pdfFonts.pdfMake.vfs;

    let localBody = [];

    localBody.push(
      [
        {
          border: [false, true, false, true],
          fillColor: '#dddddd',
          text: 'Amount',
          alignment: 'center',
          bold: true,
          style: 'tableHeader'
          //  colSpan : 2
        },
        {
          border: [false, true, false, true],
          fillColor: '#dddddd',
          text: 'Description',
          alignment: 'center',
          bold: true,
          style: 'tableHeader'
          //  colSpan : 2
        },
        {
          border: [false, true, false, true],
          fillColor: '#dddddd',
          text: 'Weight',
          alignment: 'center',
          bold: true,
          style: 'tableHeader'
          //  colSpan : 2
        }
      ]
    )

    let totalPurchase = 0;
    for (let item of bill.items) {
      totalPurchase = totalPurchase + item.amount;
      localBody.push(
        [{
          border: [false, true, false, false],
          fillColor: '#eeeeee',
          text: item.amount ? item.amount.toFixed(0) + '' : '--',
          alignment: 'right',
          //  colSpan : 2
          style: 'tableContent',
        },
        {
          border: [false, true, false, false],
          fillColor: '#eeeeee',
          text: item.category + " " + `${item.description ? item.description : '--'}` + (item.comments ? '\n' + item.comments : ''),
          //  colSpan : 2
          alignment: 'right',
          style: 'tableContent',
        },
        {
          border: [false, true, false, false],
          fillColor: '#eeeeee',
          text: item.grossWeight ? `${item.grossWeight ? item.grossWeight.toFixed(3) : ''}
         ${item.lessWeight ? '- ' + item.lessWeight.toFixed(3) : ''}
          ------
          ${item.nettWeight ? item.nettWeight.toFixed(3) : 0.0}
          ${item.rate ? 'Rate: ' + item.rate.toFixed(1) : ''}
          ${item.making ? 'Labour: ' + item.making + item.makingType : ''}` :
            `${item.nettWeight ? item.nettWeight.toFixed(3) + (item.rate ? '\nRate: ' + item.rate.toFixed(1) + (item.making ? '\nLabour: ' + item.making + ' ' + item.makingType : '') : (item.making ? '\nLabour: ' + item.making + ' ' + item.makingType : '')) : (item.rate ? 'Rate: ' + item.rate.toFixed(1) + (item.making ? '\nLabour: ' + item.making + ' ' + item.makingType : '') : (item.making ? '\nLabour: ' + item.making + ' ' + item.makingType : ''))}`,
          alignment: 'right',
          style: 'tableContent',
          //  colSpan : 2
        }
        ]
      )
    }

    if (totalPurchase > 0) {
      localBody.push(
        [
          {
            border: [false, true, false, false],
            fillColor: '#eeeeee',
            text: totalPurchase.toFixed(0),
            italics: true,
            bold: true,
            alignment: 'center',
            style: 'tableContent',
            //  colSpan : 2
          },
          {
            border: [false, true, false, false],
            fillColor: '#eeeeee',
            text: 'Total Purchase\n ',
            italics: true,
            bold: true,
            alignment: 'left',
            style: 'tableContent',
            //  colSpan : 2
          },
          {
            border: [false, true, false, false],
            fillColor: '#eeeeee',
            text: ''
          }
        ]
      )
    }

    let totalJama = 0;
    for (let item of bill.lesses) {
      totalJama = totalJama + item.amount;
      localBody.push(
        [
          {
            border: [false, true, false, false],
            fillColor: '#ffffff',
            text: item.amount ? '- ' + item.amount.toFixed(0) + '' : item.amount,
            alignment: 'right',
            style: 'tableContent',
            //  colSpan : 2
          },
          {
            border: [false, true, false, false],
            fillColor: '#ffffff',
            text: 'Old Jama ' + `${item.description ? item.description : "--"}`,
            //  colSpan : 2
            alignment: 'right',
            style: 'tableContent',
          },
          {
            border: [false, true, false, false],
            fillColor: '#ffffff',
            text: '',
            //  colspan : 2
          }
        ]
      )
    }
    if (totalJama > 0) {
      localBody.push(
        [
          {
            border: [false, true, false, false],
            fillColor: '#ffffff',
            text: totalJama.toFixed(0),
            italics: true,
            bold: true,
            alignment: 'center',
            style: 'tableContent',
            //  colSpan : 2
          },
          {
            border: [false, true, false, false],
            fillColor: '#ffffff',
            text: 'Total Jama\n ',
            italics: true,
            bold: true,
            alignment: 'left',
            style: 'tableContent',
            //  colSpan : 2
          },
          {
            border: [false, true, false, false],
            fillColor: '#ffffff',
            text: ''
          }
        ]
      )
    }
    localBody.push(
      // [
      //   {
      //   text: ' ',
      //   border: [false, false, false, false],
      //   style: 'tableContent',
      //   fillColor: '#eeeeee'
      // },
      // {
      //   text: ' ',
      //   border: [false, false, false, false],
      //   style: 'tableContent',
      //   fillColor: '#eeeeee'
      // },
      // {
      //   text: ' ',
      //   border: [false, false, false, false],
      //   style: 'tableContent',
      //   fillColor: '#eeeeee'
      // }],
      [
        {
          border: [false, true, false, true],
          fillColor: '#d1d1d1',
          text: bill.totalAmount.toFixed(0) + '',
          alignment: 'right',
          style: 'tableContent',
          bold: true
          //  colSpan : 2
        },
        {
          border: [false, true, false, true],
          fillColor: '#d1d1d1',
          text: 'Total Amount',
          italics: true,
          //  colSpan : 2
          alignment: 'left',
          bold: true,
          style: 'tableContent',
        },
        {
          border: [false, true, false, true],
          fillColor: '#d1d1d1',
          text: '',
          //  colspan : 2
        }
      ]
    )
    billBody.push(localBody);
    // pdfmake.fonts = { Hindi: { bold : 'Kruti_Dev_040_Bold.ttf' } }
    var docDefinition = {
      fonts: { Hindi: { bold: './Kruti_Dev_040_Bold.ttf' } },
      footer: [
        {
          text: (bill.narration.length ? bill.narration : ''), alignment: 'center',
        },
        {
          //holiday note
          image: 'data:image/png;base64,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',
          alignment: 'center',
          fit: [180, 180]
        }],
      content: [
        {
          style: 'tableExample',
          table:
          {
            widths: [50, '*', 50],
            body: [[
              {
                border: [false, true, false, false],
                //logo image
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABRCAYAAACnkTpxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADnQAAA50AWsks9YAABnISURBVHhe7V0JeFTVvQ+vVbtYd5bMvZMozNxlcC1112et1r2Lr6JVa+vrglTrhkJm7nbuBGmh1oUWkJC568wkEFuLtqK8urS1anFp3eCBtLYighSRLQGiBd7vf3NCiS8JM8kE0u/z9333S+acM3f5n//5/Zdz7pmqgUZ427GfztfLssekCzwreZtnJu/O25IXWkmHjsBKeIGZvNfRpe/nmHKex+Qj77pV/CT/eklYMD1xQE5Xax0zcVZgJb8VMHmqz88fXcOUXN+U53imlHZN+Uu+MWp0niUO2rmzagg/xb8PZlyfOjAwlVNdQ2GhJT+Tzypri/XK1mJWXj9vsrps3mTltbn1ymI6ov+zyhsFS9lcsNW2oq287RnyQs9M3JJjI4+eDsHx03ZBC0vtHzBF8i35Ovx9CNdYgWu05W2lrclO/b3LNTqu879FW16He8B9qO+GTHnOs5Q7PV3+fEPdyINxysEt6NxE+TOBJV0RWPLvwqyyGYLa0GQrT6FsCjT24lxGOXoWGzms+KNjDm1kqcPomJU+5tD7tKTgmtKJPpMuh1ZPL2TlF5uy6iYIah2E1xIw9VzSTrpGw7gx+xWy0umeJQV5Jv+jKau0FWxlccjkOYGlXuNpyikz9VHx3a9BRwOTjvANdbRvShcGpmzjO78pMvVdXKsttKTnfUP6bpCOHR49yGBCQ8OY/XDD5+PGn87bcnveVt8IWHKqpyWPhzA+xZuVhJ3QoJapYw52WOoMaNdPIcB38pbcmjelAob7VZ6pzA4tZSOEsxbaWsDnixuZeFi5Q3z6jYkDikxSApa4pcCUl9CR7VCKlxxLuTK8bfinebN9ixyTY+DJqSGGdJ6pK8FtGpXx6n6Bsar/COqTagi+BM20QYt3+JbUDiE3BUbiBMbO+jhv2i8U2ZgjXKZcj858JbTlNt9UiqTldH3eZO+iZWzVx/Jm8kw87FKfyVtCU/LngAN5dcVQrFeTGBVNGPLbAmgstAsapiwIDPUE3qRicKYkhqIDp0GL1+MaK3HNK4jbefXegcdqP0FWGVz1Hm7kTeLZSmnR7siZ8tnQ0j/iOpsCQ5pCBswz1Umhpa7Fwy9Gp36ZaIQ3rxh8XTkP538JxnizZ8l6np10EK8aWOSmkdFSpoD32n1Y3KKWPIlXVQwRHRjyVQVLfgsP+Kanq9/ZXYMcQ7kE9/AKjvd8Xf0+GwDtmqmPjhds6X7Yj60BkwpQqBG8amDQMiN1IIQ6BQbgfRiSef4dSYFXVQwkWFjub0Coq0Jbet7Rk+fyqi4IjeRxGLYL0cEbPFu64QUYVV5VMYR3Dv80aOJHMNLE981NmaOH86rKghx7uD9mganv+2ay8BCrLssLKBUwXl+Dxq6Ca/WMY6on8+Ju4U9CMGDJj8Cj2AD6GD8ObhqvqhjI9QsMKJSttIZMbSKXjldVBk+CTxHxXAlLuhk89+uBEiwiqNNhsf8ETn3Z15P/yYt7BVl1cPET+O6bxMG8uKIgV9PX5GlFO7UFNsYkjeZV/QMNU2jRaUVLXhPayee8OvlIXlVReBlJyVvKw6Cdt0OW/DovLgmuqXwxQCBBPEwdxIsrCgqXQVP3I7prg6fybdJoXtV3uCD20Fb+DN55k4TMiysKJ5MYGmTlGXmmtMKQTeTFZYF4GtRAdNIS6tJRvLiigFEdUbBTz4ZMegf3+tl+5SYaxlV/CoblHgh2C/UWL644Zms11eTOUXKngZUX0XWCvAkvK50Du3ANJXF4ccXh1ytjQI8rPFv+jZM5figvLg9EB/SwCDG3BKbazBjbN9HKIIRvjb4Zxm0b7MMdfQoyQnbssIIpv4joaPEv7lCqefFHACiICk31VzCg7yJsLo8eiKzBYXWBrbZ7lnIDL/4Iu6ExIx0Lzf0HAoyfUxKIF+8ZIRuVQGSyEqHf78kN48Uf4UMIDfmewFS2ekz9aklJHhImjFgWHsJmysHy4o/QDcig+Yb8hmfKiyiXzYt7BoW0UPeVjpX4HS+qCNCz+7t6LO6a4olBuuZcVxO/62TE2xxNuCWni1d7merTnTrhuMYpw4Y3lBikUN61MTNseBMO7+aDD8E1aJQN6YYDO8uGUKKH2tL3ZmtHVLewoQf2x6VCtKr5hrLVN+Wzez0PO6vq45QFQgi6FUT9X7y4z2hpqfqYawhJt0642dOEhZ4uvu3pQiv+b/e1+I7AiO+kw9fF7b4R2+bqwnr8/zcvIzyPwwk08XonLZzcU/LaN+JfdrXYQnz3DZxziaPFnvD02AJPiz3up8UfkONP9gOfTV+PPYq2j+B8jwZ67DVHq17maeLD+N7FZXHmh0A+um9Jq3A8xMb24jn8ktUeArdruWuofyiJQ3rBnEmC6GViP4Sw3oEQuBBxdP7tPOgzL/P4Qf9T+9Ciz+Ky0BC/yk/bBXSP8/BwbiZ+HYS0NDQ7zlW06fvCrCKrPoJcpdAQWqKORH1oijv9jPhskI5dQsLHafqstZ0A9870DGlLAdFhtylQUmmaq/JN5Z+hqYzjxX1CLiMeDaE8ET1Ih+C2Q0vWOhnhaRyeo8Une2nhJgjkLleLN+Pvb3xNXIHj/d2FTAJxMvFWaNst/NQ9At+9FFSzjARMneJqwqyGCR3C9SFcuo/QqqHzvoq2FU2TkjsWWHIbApg7aRKBF/8LlJzwLLWIHlhX6EeEQ7wa6OKDBbumQxu1+FvOpPhkJ1OT6m54U0/Po4xb3fAj/UzsctDBfHTMZp9rIQS2Ddw8iTfvEaTFoJyfobN25Bl1jjCThEtDvlO4eRIuOralY7a3YiD6Cy3lMbitS+dP68awce5Y4xnyXF5UNp6EQcEQ/nqeNEcXdzp67FnPrCkrkULGzEmLV4KTXykwEkZpwiVAoN8jGiJa+LDmEiXQufxMzWX9pbzu4DH5Joz6bTgu7UINRAmOoV4On+0Dmv3kxWWDrC/47OdN0Fo83F99TbiQV5UNCPQsLyPCsInbc3VCHS/uFY4RuwTD/vXmelwfnIuO2iXciCoysVVenfB53ryioGSRbykbXVP6aZfOI57wreR94I11IHmRF5eE6Ob5jASG3mjXiL8JDdnhatX5qEE/AE0cC+G+Di9A50W9wr9dOBbD/ummbNS5XTS3g4djbzuZEWfx5hXFCw1V+4VM/r1rSUs9r/YTvLiqijgPUn8FQcPTvKhk0Ny/p4+aSv/D5TkefPkeeLIdAr43atAPRB5HWnBgBG1e1CvA8aNw3Scizd3LwiVAfjaCr405NvJzvIj4Ink8/NttnimVxG2doFUwXlq82s2IHn0m4Qa6sI6MCoZgIWrUD5Bg4GZprh7XeFGvaEyLCXTskz3SwgAL12HSGYGttIeW9B18jHh3CCWafVNqD7Ly+VRQKnCjQzFkixi+8+gzfEcJ1v41ssrgzNcrwW9EDeDub/KPvWJfC5eWQwVMXukaiaYoWiPyhWB/jKhsfV6rKSu16GuHCYiqFvmG+OILiIQabxUP8wxxdjEyaPHt8Hcf9zK1Cm/eJ8y7S/zknSUuL4qEm9l3wqVrgRae9A35zw3gYPi3VfvBBXsYnLuUtykZJFxo1nMwZP9w08JFVIao7Bx4DG3kV8Jy70CA8JdAj02g9VzRlwYQ+1pzCaGVnBnY0uqAjaypoplcCPfvIOOyrTsNAzcjFCgqyunCA1QWGUetZhwe6L3It0QgAZ/3ffi8L8OS6zkjJncbxVQA+1pzCbRakuYCaa0wnHbpiNCW14ZG8i5eXzKiRcda7HqKxiC4d9107Hoqp6VNuXTtqbDc98N7aKUwloQcaTKcfFh/REzCZZVesjkYNJeWQuWzylbXVL9SNUdLnEIJX0dP/DevLwuuIR7j6MJK0l7w78pcWriGV0XTITlTOBuU0QyNWkPhMNFFRBmG2I6HXgxjNQPl57XUHdrvkHQwaG74wxMSgZ36wGfKD6o6lror2zyjvLUCnSCDkwOnBlxwEPBqJxO7bQZLHcibRNNGjUatCpdqArT5KYSorZ2CjrJVehwcLTznGTHTYTWpvoang0FzG1iqBvLcAKplVZ4l3ZC3lTaHpVK8vmyEbPgw3HjYmfKDANuhkU/BHftOTh9Ru7uwKM3n6NVnUGbM12PPQtCbqWNIyBD4jkAT3wa95Jz08F6XMnWHXcLdBxFaJyhxU8yqi11DeiBKOOTtVBu9FMLr+wTv9toRMG4/hoA2RkImzdTjH8Cb+CuENQcPfT5pUuecHPmBLVNHHhyY4lng4pkQwBuBIUYJ9BAHUQzoJu3dXHtIdIESMBiES8rTBOEiIPvFLuHm+ilcAhm4QI+d6+nVD+KBNpC3EA37SCuFNhizxV4m7jiThMtyEw+PdWo0eQ9FQ0giukuj3RIIeSfvoDZfi08Dd5ck4F2cu0+Fe9JBxcnqkooLtxPEw/BvT4HPO9XXxJdCXWwnbezkWJS1Q6OXIND4CU3jkAD4V4fg4VO+GXcQmLRTpIe2m9A2jY7Y4yz07pqL73TJ5+4t4dLbR8X61GMIzAZGuJ0gzZwBuvAy4lfxYHN8LfY6tLK9kzaIBqCpa2k2ws/Unt0ydmzk/+bZYQeBjw3QRWuREtwIqb30iAuik/aCwWDQgCGghcJuwlUHRLi7gxLpORaP+XXipTB4ed8UVkG42yPagKCh6e+ANqZ2huAQwlAIfmYeHUE+MgzkTyCsXmeFBwPnzrv1lE821atP7VXh7o4WVrX/nAkxCZHb7WEHx+7gMwX/hJCLzXosTu1crfqzoIcn50ITUfe0Ywq9ehCDQXOJcwtZubKc2xfflKZD3AmxOKUVAy2+IjQjIW6naXVKAlEbeBq3Q2A7aC7OnxS7PPpiDxgMmtvFW/Bt+bqwH8Ilg9GoixdQ4MCL+gQI+IsQzEtRRg0hci4jfI/Kw0k1p8H3fQHUsKVRF66LGveAwSDc+RPh59rqYt9M/LIqYNIZPq13suSxvL4sRO9KaPFrXaPa5UV9xRB4DuPgSm3NQ4OdTLyR3tLx2NAReVNohpu2pXHS4BcuTXkFtrKO3qOo8lnyJBKuayT6tLg5yh9osfF4mGd4UZ8R5Sk08XHiWJxvoTvxiCTRDXznu0EXrT6Ez5t2i8EgXLf++CSE+wFFvlWz0jWHIvxdk7ek6by+LFDggDD3BrhOq8kA8eI+ITcxHoPHEMybXAtBiC+DBqKZjNCI3RMa4jKU9TpTMhgMmmsec2aeqVtcI3lRtJjNN+W3QiPZwuvLAgnXz8S/T34rwtX7eHGfcN+togC+7RAuzXAw8SQKkyGcn/q6+BAtHOFNu8VgEG5gJsYXbLk1ehuJLu5a8iO+IS/n9WUhmqTU4uObo5yusMKti3+JV5WNwBihOhnh0bn1teTbPkD5ipnwJjwtNjswYxN4sx7hThSSiOj2qXBDW270LWlVnlbjk2a4pnJHaEobm/VRkX9ZDiidSCtkOpYQ0SEsIg3i1WXBSwvXwA1ro9ljCHRKVGZWn45g4jqaZo8a9QI3U/1Fyl+QcD0IlxbiUTgKzr6fokLUrfEyNefw5hXH9OkXHFDIKk+5ZuKFznB9iKtLV/iW/H7AEpdErcoEhux/Qqid6cbtrh5bBFfqbF5dEoK62AkwQr8tZmt3wqi9Dv7+SlSeVg4nwxQ12gNCLfYldPByGkUU0U2/8bCD5txWc1Sox3/bsU5M/AD3euVATTPRrE5gymvg4zrR7C+BFnaAd7fhMKKCMuFEacOOFY0d2oshSOtsteqbwOnDeLMeUehYTDKfViGCM9sROPxoZx+CEhIuuH95gbQURpbKaPY5MMWnoySQIaLjhJvK3UOnVDjZ5MmhTe9FJ8bvWi/GJymX+GbyyaigTMDwQHO7CpcOaEl7YMRedvQaixbk0QpImgXOTTz8M65+aDxaTa6LP4RGvR5lzeg7hthCCXZ+6rKAe7gRnbMexw6cN5q2yk08UibhUscVwLvQaL+JxSuy2caHEVjKlIDJG9z6o47hRVVVYzFMPFO5FwJ+L39HeWsXCEQLgSnspCRLZ2qxq5Dj2yG0TeDTFThehOF7GgL4G4SxEfVRXoHahEZNS5HVjOSnLRuk8R20JLyX4wumwcNnekb8VRJudB1NfDvUhS9EX6ggyHDCBfutZ0iLu2x6RPxAb4t3OL/y1by4ZETamK6+GkZoPHGdnxHmh6ZIK7034MF2kDGJHmyXdnbkdaPUoyG2w2C9mKurvrEUCukJUQ7ZEH2aiQZnL8vVidGL2TBm38I9rMwzCNcQP8jrYpunxxpozUX0xQrB15ICAodWz5Rn/b88i3d7agSM2ipXSz7Ii/oE4hqcfH+4PENzRuwEr074GoQ+ET6wAw1/DMcfwYePU3KG1jGQhZ/F+i7UTqDTRqGTHpuL6AzG9YE5ek30/i9oqQHX3Iyyh0AVVzqGcJyTHjay0rwbMCkNWkCkm7yoy/pcAuVbPUNucA35XV8fPYoXVww0OhbcmDiAHoqSPayqfIPVG8gdRGetiBI/aWEaBUf31dUeCbpqgp97azlzceUi2jLAUP6AwGEp6GHXrPcuRP4upO5byvaAKXt02AcTiO/A3TOJbsDlrY5eHS3gnjNp1GjHOPK4gfIOOhHWjz4usKQ2jyXtHr0cmhYObPVl31TgBFd+35iBQkjBgxZ/NYoSM7HHc5nhR/OqvYLQTDZCZptomwB87EoJnSDn2jOTN4F72x1D6jUxPVgQuZG6cF+ktZn4doTPt9JMB68ecMyZlBARH6zyLfUXFK3y4u7hsdQIWmMKAT/CiwY1QAPfRsCyqgmRnavHF1B+glftFQRmcmpoqltdlrxoj7MxtMsRrdfNW/LmPEucx4sHJdw64Qtw/V6I3t7R4yu9dE2fEv59RfPk0fHQIkVUHn+S7fYeRG8IJ0tH0bYr0N5n+vPq5kAif9uIlK/FH6HXqSDYLQhMbiHDxqv3ChxL/lm0FMxUL9yj1naCloDSPgv4YntgJaO5rMEEekMTgv1lR6YLgjXiOiVpePVegZuVTgxteR28BI/WJPPi0kD7GkLlny1Y8l8cluxzSFpJRLPFE4WLINBFFHEhInsXIfSk/I3RO7x7DbQ2wTfkX+dtdX20U0hPHkJPIDUPmXRBgSlb4GrM3Vm1s7wTlAhyunGjX3bgpQTpnjfa9DVRCHTRQrT1VoFR+CwsdvXYFbjPXcucKMp0Dem7jpH8ZrHSm6vtBngHt4dM3QL5TNqjh9ATSN3hOdxdsOU2V5d7nXntB4aEhnxtYNIOo2pjeOexXV4uIc530jWXhJrwu3xHbmINjNi0xvTQxIc1JjDlqaGltAVmasJA8a9rqmfCHq0JmfIobXrMi/sGcs3gHD+BY2WQPfpUXlxR0C4btNMRBLPBM5U0L44QaPHP5c34r8Cvi2iFTjNcre4E51mjrglNeTWc+bm0AJkXVxT0wjkZeRJuTpM/tysh3lfQCXzzmDGhra4Gx7zqsYHZEY94HaPkgcBS1rqW8i1eHE3dU7aMG6xuHwbD8wvonNcwVF+AEpzCiysK2mIQzz6/kFXXh0y+ts908GFE7wbD3QgtlTYHXuhM6eNmZXtAzkicgPP/HkJa6unSHlc1EkAnp8KzWeRb0tvE3by4oqD34FxTzmFktftMra94roJmeRGF/AA9txXu2SMNEwbGYPiadGFgyMthNJa4Wu9vdJJgcSzC8Y5ryFeVbbVLAK2s9A0ll2fqNlzn3oapYyq6V8Mu0BClhXuBTVtbywuapgzMfrJeNnkxjNNycOjigil1u62AZ0qn4x7+iHarI8H2l/+6Af3EATg8V7DVraCde72bjxuwtGWEKONvKrfQEIET/aJrjj6RV1UUgZG4JDSlZbRJMULx6xrGVUUcRy5itN2sJf0VDvxqh0nfGAjBNrJRCTzfwtBWPgDlTPfuGWDBdqJlLC20kC/zTHlNgakr6S3tsS0dq8IrCfrtCAjwfyjEhOb82MkkUuBjA/9v8Jn8Jz8rlR52lghK4hN3w/1cjI7djNExsdLbtuwR9FBFUxkDbnwKmtUOi/1AUF/5HfBpi1l4EbPgAuFByRdWtsGAzc8xpeI528bMUcPzlvqzYlbdiE78Cyjh0paWfZjXjvbGMRSWt6R1hay8mnYooh/fqMRQpTfhm5h0LLSnoUOw8nYM023QqIfBtec/1ND/HahJU+E3jyhY0g1FW3kF/LrRNyWHfr+n0qOiT6B3yxDBnYaHby5mlY3FrLwGlnW2Z44+nXbn581KArl9IRs5zDOTF2M0NOF860A9qyDMuwOWvIhcIWjW35qy8uaCrTzos9Rls+9Qqml5AD9FSaCw22WjPuvbyrRivby8yU5twih82IEBJcPNmw0e0E25WfVM30wWSSjQhNaiLT/n2/JdGMrfow6gKIeivmkTT/sMWeMoAjRkOdCjRdjjPEtuhPYsac6qreC9FQGT7vWhvZ1LkEibaAtu+t0InH95c73cVrRh+Ew5BFfeDC/inEYjqSLqi93DjjuEoj9KQhUm069OqSf7hnS5ZyiTwdt/wD2uL9YrGxAgPQhtvXDG9d1MLg420Cwv3KNjXCZNgMVd0FSv/L0JwmrKKpvmTVZXgT5eD5j6XGinXizWq8vn1qvv4kE3N9WrG9FmKYQ0NzSS15LF7unHPei1qoa6VE3eUq6ERhegyUvw3Q3Uofx8b4BC/pw31eebmLJkbja1qjmb2kSJKLRdGdrSE/A6MrT4m35WjJ/23wpDSJspY0+/VgIuvhbUoSNETWNIZ0I7iQN/WfJ2POQ3PZY4hTZFpqlq/v2SEK20zBw/1EknT240EldB2ycULCVTiM6PA//TUTDl8TTDHeo1R1FwMBBBx79QVfV/eYunK5aQAcYAAAAASUVORK5CYII=',
                fit: [50, 50],
                margin: [8, 5, 0, 0],
                //  fillColor: '#f4e1b2'
              },
              {
                text: [
                  { text: 'Shankheshwar Jewellers\n', style: 'header', color: '#473200' },
                  { text: '7th Lane, Gandhi Chowk, Jaysingpur\n', style: 'sub_header' },
                  { text: '9421287086/9325420344', style: 'url' }
                ],
                border: [false, true, false, false],
                margin: [0, 8, 0, 0]
              },
              // { text: '||श्री||' },
              // { text: 'शंखेश्वर ज्वेलर्स', style: 'header' },
              // { text: 'उत्सव नात्यांचे...परंपरा विश्वासाची...!', style: 'sub_header' },
              // { text: '||श्री||' },
              {
                border: [false, true, false, false],
                //Hallmark image
                image: 'data:image/png;base64,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',
                fit: [65, 65],
                margin: [0, 8, 10, 0],
                alignment: 'center'
                //  fillColor: '#f4e1b2'
              }
            ],
            [
              {
                colSpan: 3,
                border: [false, false, false, true],
                //tagline
                image: 'data:image/png;base64,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',
                fit: [130, 130],
                alignment: 'center',
              },
              {},
              {}
            ]
            ]
          },
          layout: {
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
            },
          }
        },
        /* {
          table: {
            widths: ['*'],
            body: [[""]]
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 ? 0 : 1)
            },
            vLineWidth: function (i, node) {
               return (i === 0 || i === node.table.widths.length) ? 2 : 1;
             }, 
            hLineColor: function () {
              return 'gray';
            },
            vLineWidth: function (i, node) {
              return 0;
            }
          }
        }, */
        {
          columns: [
            {
              text: `\nVoucher No : ${bill.voucherNo}`, alignment: 'left', margin: [0, 0, 0, 5]
            },
            {
              text: `\nDate: ${bill.date.substr(0, 10).split('-')[2] + '/' + bill.date.substr(0, 10).split('-')[1] + '/' + bill.date.substr(0, 4)}`, alignment: 'right'
            }
          ]
        },
        {
          text: `Name: ${bill.customerName ? bill.customerName : '-'} ${bill.customerContact ? ' (' + bill.customerContact + (bill.isWhatsapp ? '-W' : '') + ')' : ''}${bill.customerAddress ? ' ' + bill.customerAddress : ''}`,
          bold: true, margin: [0, 0, 0, 5]
        },
        {
          style: 'tableExample',
          table: {
            widths: [80, '*', '*'],
            body:
              localBody,
          },
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            /*  vLineWidth: function (i, node) {
               return (i === 0 || i === node.table.widths.length) ? 2 : 1;
             }, */
            hLineColor: function (i, node) {
              return (i === 0 || i === 1 || i === node.table.body.length || i === node.table.body.length - 1) ? 'black' : 'gray';
            },
            /*  vLineColor: function (i, node) {
               return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
             }, */
          }
        },
        {
          text: `${bill.billClear ? "" : "\nAmount Paid : " + bill.paidAmount + "\nPending Balance : " + bill.outstandingAmount}`
        },
        {
          text: "\n\nThank you for shopping with us..!",
          alignment: "center"
        },

        // {
        //   text: 'Thank you for shopping with us!!',
        //   alignment: 'center',
        //   fontSize: 12
        // },
        /*     {
              table: {
                widths: ['*'],
                body: [[""]]
              },
              layout: {
                hLineWidth: function (i, node) {
                  return (i === 0 ? 0 : 1)
                },
                vLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 0 : 0;
                }, 
                hLineColor: function () {
                  return 'gray';
                },
                // vLineWidth: function (i, node) {
                //   return 0;
                // }
              }
            }, */

      ],
      styles: {
        tableExample: {
          margin: [0, 5, 0, 1]
        },
        tableContent: {
          fontSize: 11
        },
        tableHeader: {
          fontSize: 12
        },
        header: {
          bold: true,
          fontSize: 17,
          alignment: 'center',
          //    font: 'Hindi'
        },
        sub_header: {
          fontSize: 10,
          alignment: 'center'
        },
        url: {
          fontSize: 10,
          alignment: 'center'
        }
      },
      pageSize: 'A5',
      pageOrientation: 'portrait',
      pageMargins: 0
    };

    console.log(docDefinition);

    // pdfmake.createPdf(docDefinition).open();
    //  loader.dismiss();
    let billItem = pdfmake.createPdf(docDefinition);

    if (this.plt.is('cordova')) {
      billItem.getBuffer((buffer) => {
        var utf8 = new Uint8Array(buffer);
        var binaryArray = utf8.buffer;
        var blob = new Blob([binaryArray as BlobPart], { type: 'application/pdf' });

        this.file.writeFile(this.file.dataDirectory, 'myBill.pdf', blob, { replace: true }).then(
          fileEntry => {
            this.fileOpener.open(this.file.dataDirectory + 'myBill.pdf', 'application/pdf');
          }
        ).catch(
          error => this.presentToast("fileopener: ", error)
        ).finally(
          () => loader.dismiss()
        );
      })
    } else {
      billItem.download();
      loader.dismiss();
    }

    // let billFileName = "SJ" + bill.voucherNo;
    // billItem.getBuffer((buffer) => {
    //   var blob = new Blob([buffer], { type: 'application/pdf' });
    //   this.file.writeFile(this.file.dataDirectory, billFileName, blob, { replace: true }).then(fileEntry => {
    //     console.log(fileEntry)
    //     //   loader.dismiss();
    //     //   location.reload();
    //     this.presentToast("File saved at: " + this.file.dataDirectory);
    //     this.fileOpener.open(this.file.dataDirectory + billFileName, 'application/pdf');
    //   }).catch(
    //     error => this.presentToast("Error in generating bill: " + error)
    //   ).finally(
    //     () => loader.dismiss()
    //   )
    // }
    // );
  }
}
