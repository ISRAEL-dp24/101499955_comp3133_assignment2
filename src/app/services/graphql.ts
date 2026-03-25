import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

const LOGIN = gql`
  query Login($username: String, $email: String, $password: String!) {
    login(username: $username, email: $email, password: $password) {
      token
      user { _id username email }
    }
  }
`;

const GET_ALL_EMPLOYEES = gql`
  query {
    getAllEmployees {
      _id first_name last_name email gender
      designation salary date_of_joining
      department employee_photo
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!, $last_name: String!, $email: String!,
    $gender: String, $designation: String!, $salary: Float!,
    $date_of_joining: String!, $department: String!, $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name, last_name: $last_name, email: $email,
      gender: $gender, designation: $designation, salary: $salary,
      date_of_joining: $date_of_joining, department: $department,
      employee_photo: $employee_photo
    ) {
      _id first_name last_name email designation department salary
    }
  }
`;

const SEARCH_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeById($eid: ID!) {
    searchEmployeeById(eid: $eid) {
      _id first_name last_name email gender
      designation salary date_of_joining
      department employee_photo
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $eid: ID!, $first_name: String, $last_name: String,
    $email: String, $gender: String, $designation: String,
    $salary: Float, $date_of_joining: String,
    $department: String, $employee_photo: String
  ) {
    updateEmployee(
      eid: $eid, first_name: $first_name, last_name: $last_name,
      email: $email, gender: $gender, designation: $designation,
      salary: $salary, date_of_joining: $date_of_joining,
      department: $department, employee_photo: $employee_photo
    ) {
      _id first_name last_name email designation department salary
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid)
  }
`;

const SEARCH_BY_DESIGNATION_OR_DEPARTMENT = gql`
  query SearchEmployeeByDesignationOrDepartment($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
      _id first_name last_name email designation department salary
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP,
      variables: { username, email, password }
    });
  }

  login(username: string, password: string) {
    return this.apollo.query({
      query: LOGIN,
      variables: { username, password },
      fetchPolicy: 'no-cache'
    });
  }

  getAllEmployees() {
    return this.apollo.query({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'no-cache'
    });
  }

  addEmployee(data: any) {
    return this.apollo.mutate({ mutation: ADD_EMPLOYEE, variables: data });
  }

  searchEmployeeById(eid: string) {
    return this.apollo.query({
      query: SEARCH_EMPLOYEE_BY_ID,
      variables: { eid },
      fetchPolicy: 'no-cache'
    });
  }

  updateEmployee(data: any) {
    return this.apollo.mutate({ mutation: UPDATE_EMPLOYEE, variables: data });
  }

  deleteEmployee(eid: string) {
    return this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { eid }
    });
  }

  searchByDesignationOrDepartment(designation?: string, department?: string) {
    return this.apollo.query({
      query: SEARCH_BY_DESIGNATION_OR_DEPARTMENT,
      variables: { designation, department },
      fetchPolicy: 'no-cache'
    });
  }
}