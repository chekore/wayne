import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { EdgeNode } from '../../model/v1/edge-node';
import { PageState } from '../../page/page-state';
import { isNotEmpty } from '../../utils';

@Injectable()
export class EdgeNodeService {
  headers = new HttpHeaders({'Content-type': 'application/json'});
  options = {'headers': this.headers};

  constructor(private http: HttpClient) {
  }

  getByCluster(cluster: string): Observable<any> {
    return this.http
      .get(`/api/v1/services/edgenodes/cluster/${cluster}`)

      .catch(error => Observable.throw(error));
  }

  list(pageState: PageState): Observable<any> {
    let params = new HttpParams();
    params = params.set('pageNo', pageState.page.pageNo + '');
    params = params.set('pageSize', pageState.page.pageSize + '');
    params = params.set('sortby', '-id');
    Object.getOwnPropertyNames(pageState.params).map(key => {
      let value = pageState.params[key];
      if (isNotEmpty(value)) {
        params = params.set(key, value);
      }
    });
    let filterList: Array<string> = [];
    Object.getOwnPropertyNames(pageState.filters).map(key => {
      let value = pageState.filters[key];
      if (isNotEmpty(value)) {
        if (key === 'deleted' || key === 'id') {
          filterList.push(`${key}=${value}`);
        } else {
          filterList.push(`${key}__contains=${value}`);
        }
      }
    });
    if (filterList.length) {
      params = params.set('filter', filterList.join(','));
    }
    // sort param
    if (Object.keys(pageState.sort).length !== 0) {
      let sortType: any = pageState.sort.reverse ? `-${pageState.sort.by}` : pageState.sort.by;
      params = params.set('sortby', sortType);
    }
    return this.http
      .get('/api/v1/services/edgenodes', {params: params})

      .catch(error => Observable.throw(error));
  }

  create(edgeNode: EdgeNode): Observable<any> {
    return this.http
      .post(`/api/v1/services/edgenodes`, edgeNode, this.options)

      .catch(error => Observable.throw(error));
  }

  update(edgeNode: EdgeNode): Observable<any> {
    return this.http
      .put(`/api/v1/services/edgenodes/${edgeNode.id}`, edgeNode, this.options)

      .catch(error => Observable.throw(error));
  }

  deleteById(id: number): Observable<any> {
    return this.http
      .delete(`/api/v1/services/edgenodes/${id}`)

      .catch(error => Observable.throw(error));
  }

  getById(id: number): Observable<any> {
    return this.http
      .get(`/api/v1/services/edgenodes/${id}`)

      .catch(error => Observable.throw(error));
  }

}
