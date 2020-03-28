"use strict";function QRCodeDataBlockReader(t,i,e){this.blockPointer=0,this.bitPointer=7,this.dataLength=0,this.blocks=t,this.numErrorCorrectionCode=e,i<=9?this.dataLengthMode=0:i>=10&&i<=26?this.dataLengthMode=1:i>=27&&i<=40&&(this.dataLengthMode=2),this.getNextBits=function(t){let i=0;if(t<this.bitPointer+1){let s=0;for(var e=0;e<t;e++)s+=1<<e;return s<<=this.bitPointer-t+1,i=(this.blocks[this.blockPointer]&s)>>this.bitPointer-t+1,this.bitPointer-=t,i}if(t<this.bitPointer+1+8){var s=0;for(e=0;e<this.bitPointer+1;e++)s+=1<<e;return i=(this.blocks[this.blockPointer]&s)<<t-(this.bitPointer+1),this.blockPointer++,i+=this.blocks[this.blockPointer]>>8-(t-(this.bitPointer+1)),this.bitPointer=this.bitPointer-t%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),i}if(t<this.bitPointer+1+16){s=0;let r=0;for(e=0;e<this.bitPointer+1;e++)s+=1<<e;const n=(this.blocks[this.blockPointer]&s)<<t-(this.bitPointer+1);this.blockPointer++;const o=this.blocks[this.blockPointer]<<t-(this.bitPointer+1+8);this.blockPointer++;for(e=0;e<t-(this.bitPointer+1+8);e++)r+=1<<e;return r<<=8-(t-(this.bitPointer+1+8)),i=n+o+((this.blocks[this.blockPointer]&r)>>8-(t-(this.bitPointer+1+8))),this.bitPointer=this.bitPointer-(t-8)%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),i}return 0},this.NextMode=function(){return this.blockPointer>this.blocks.length-this.numErrorCorrectionCode-2?0:this.getNextBits(4)},this.getDataLength=function(t){let i=0;for(;t>>i!=1;)i++;return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][i])},this.getRomanAndFigureString=function(t){let i=t,e=0,s="";const r=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":");do{if(i>1){const t=(e=this.getNextBits(11))%45;s+=r[Math.floor(e/45)],s+=r[t],i-=2}else 1==i&&(s+=r[e=this.getNextBits(6)],i-=1)}while(i>0);return s},this.getFigureString=function(t){let i=t,e=0,s="";do{i>=3?((e=this.getNextBits(10))<100&&(s+="0"),e<10&&(s+="0"),i-=3):2==i?((e=this.getNextBits(7))<10&&(s+="0"),i-=2):1==i&&(e=this.getNextBits(4),i-=1),s+=e}while(i>0);return s},this.get8bitByteArray=function(t){let i=t,e=0;const s=new Array;do{e=this.getNextBits(8),s.push(e),i--}while(i>0);return s},this.getKanjiString=function(t){let i=t,e=0,s="";do{const t=((e=this.getNextBits(13))/192<<8)+e%192;let r=0;r=t+33088<=40956?t+33088:t+49472,s+=String.fromCharCode(r),i--}while(i>0);return s},this.parseECIValue=function(){let t=0;const i=this.getNextBits(8);if(0==(128&i)&&(t=127&i),128==(192&i)){t=(63&i)<<8|this.getNextBits(8)}if(192==(224&i)){t=(31&i)<<16|this.getNextBits(8)}return t},this.__defineGetter__("DataByte",function(){const t=new Array;for(;;){const n=this.NextMode();if(0==n){if(t.length>0)break;throw"Empty data block"}if(1!=n&&2!=n&&4!=n&&8!=n&&7!=n)throw`Invalid mode: ${n} in (block:${this.blockPointer} bit:${this.bitPointer})`;if(7==n)var i=this.parseECIValue();else{const o=this.getDataLength(n);if(o<1)throw`Invalid data length: ${o}`;switch(n){case 1:for(var e=this.getFigureString(o),s=new Array(e.length),r=0;r<e.length;r++)s[r]=e.charCodeAt(r);t.push(s);break;case 2:for(e=this.getRomanAndFigureString(o),s=new Array(e.length),r=0;r<e.length;r++)s[r]=e.charCodeAt(r);t.push(s);break;case 4:i=this.get8bitByteArray(o);t.push(i);break;case 8:e=this.getKanjiString(o);t.push(e)}}}return t})}