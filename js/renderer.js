/*!
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Thomas J. Otterson
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(){define(["jquery","./mandelbrot"],function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n;return c=2.6,d=2,e=0,f=!1,g=function(c,d,g,h,n,o){var p,q,r,s,t,u,v,w,x,y;f=!1,p=m(h),q=p[0],r=p[1],s=b.calculator(h.palette,h.escape,h.depth,h.continuous),t=(q[1]-q[0])/(c.width-.5),u=(r[1]-r[0])/(c.height-.5),i(h,q,r),e++,v=function(a,b,d){var e,f,h,i;for(null==d&&(d=0),e=a,f=0,h=c.width;h>=f;++f)i=s(e,b),g.data[d++]=i[0],g.data[d++]=i[1],g.data[d++]=i[2],g.data[d++]=255,e+=t},w=function(a,b,d){var e,f,i,l,m,n,o,p;for(null==d&&(d=0),e=a,f=0,i=c.width;i>=f;++f){for(l=[0,0,0,255],m=0,n=h.supersamples;n>=m;++m)o=Math.random()*t,p=Math.random()*u,j(l,s(e-o/2,b-p/2));k(l,h.supersamples),g.data[d++]=l[0],g.data[d++]=l[1],g.data[d++]=l[2],g.data[d++]=255,e+=t}},x=function(a,b){var d,e,f;for(d=a*c.width,e=0,f=c.width;f>=e;++e)g.data[d++]=b[0],g.data[d++]=b[1],g.data[d++]=b[2],g.data[d++]=b[3]},y=function(){var b,i,j,k,m,n,p,s;b=Date.now(),i=b,j=0,k=r[0],m=0,n=e,p=h.supersamples>1?w:v,a("#size").text(c.width+" x "+c.height),(s=function(){var r,t,v;if(n===e){if(f)return void o();p(q[0],k),k+=u,j+=c.width,d.putImageData(g,0,m),r=Date.now(),m++<c.height?r-i>=h.update?(x(0,[255,59,3,255]),d.putImageData(g,0,m),t=r-b,a("#render-time").text((t/1e3).toFixed(1)),v=1e3*j/t,"NaN"===l(v).substr(0,3)?(v=Math.floor(60*j/t),a("#render-unit").text("min")):a("#render-unit").text("s"),a("#render-speed").text(l(v)),a("#pixels").text(l(j)+"px"),i=r,setTimeout(s,0)):s():(a("#pixels").text(l(j)),o())}})()},n(),y()},h=function(a){var b,c;b=a[0]/a[1],c=window.innerWidth/window.innerHeight,c>b?a[0]*=c/b:a[1]*=b/c},i=function(b,c,d){var e,f,g,h,i,j;e=c[0],f=c[1],g=d[0],h=d[1],i=Math.abs(e-f),j=Math.abs(g-h),a("#domain span").html("d<sub>Re</sub> = "+i+" | d<sub>Im</sub> = "+j)},j=function(a,b){a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a[3]+=b[3]},k=function(a,b){a[0]/=b,a[1]/=b,a[2]/=b,a[3]/=b},l=function(a,b){var c,d,e;return null==b&&(b=2),c=["","k","M","G","T","P","E"],d=Math.floor(Math.floor(Math.log(a)/Math.LN10)/3),e=(a/Math.pow(10,3*d)).toFixed(b),e+" "+c[d]},m=function(a){var b;return b=[c/a.zoom,c/a.zoom],h(b),[[a.re-b[0]/2,a.re+b[0]/2],[a.im+b[1]/2,a.im-b[1]/2]]},n=function(){f=!0},{render:g,stop:n,getRange:m}})}).call(this);