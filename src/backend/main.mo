import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Bool "mo:core/Bool";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Project = {
    id : Text;
    name : Text;
    ownerId : Principal;
    createdAt : Int;
    updatedAt : Int;
  };

  public type Page = {
    id : Text;
    projectId : Text;
    name : Text;
    order : Nat;
  };

  public type Element = {
    id : Text;
    pageId : Text;
    elementType : Text;
    propsJson : Text;
    order : Nat;
  };

  module Project {
    public type Id = Text;

    public func compare(a : Project, b : Project) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  module Page {
    public type Id = Text;

    public func compare(a : Page, b : Page) : Order.Order {
      Text.compare(a.id, b.id);
    };

    public func compareByOrder(a : Page, b : Page) : Order.Order {
      Int.compare(a.order, b.order);
    };
  };

  module Element {
    public type Id = Text;

    public func compare(a : Element, b : Element) : Order.Order {
      Text.compare(a.id, b.id);
    };

    public func compareByOrder(a : Element, b : Element) : Order.Order {
      Int.compare(a.order, b.order);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let projects = Map.empty<Text, Project>();
  let pages = Map.empty<Text, Page>();
  let elements = Map.empty<Text, Element>();

  // User Profile Methods
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project Methods
  public shared ({ caller }) func createProject(name : Text) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to create project");
    };
    let id = name.concat(Time.now().toText());
    let project : Project = {
      id;
      name;
      ownerId = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    projects.add(id, project);
    project;
  };

  public query ({ caller }) func getMyProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to view projects");
    };
    let myProjects = List.empty<Project>();
    for ((_, project) in projects.entries()) {
      if (Principal.equal(project.ownerId, caller)) {
        myProjects.add(project);
      };
    };
    myProjects.values().toArray().sort();
  };

  public shared ({ caller }) func updateProjectName(projectId : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to update project");
    };
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (not Principal.equal(project.ownerId, caller)) {
          Runtime.trap("Unauthorized: This is not your project");
        };
        let updatedProject = { project with name; updatedAt = Time.now() };
        projects.add(projectId, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to delete project");
    };
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (not Principal.equal(project.ownerId, caller)) {
          Runtime.trap("Unauthorized: This is not your project");
        };
        // Remove associated pages and elements
        let pagesToDelete = pages.values().toArray().filter(func(p) { p.projectId == projectId });
        for (page in pagesToDelete.values()) {
          let elementsToDelete = elements.values().toArray().filter(func(e) { e.pageId == page.id });
          for (element in elementsToDelete.values()) {
            elements.remove(element.id);
          };
          pages.remove(page.id);
        };
        projects.remove(projectId);
      };
    };
  };

  // Page Methods
  public shared ({ caller }) func createPage(projectId : Text, name : Text) : async Page {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to create page");
    };
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (not Principal.equal(project.ownerId, caller)) {
          Runtime.trap("Unauthorized: This is not your project");
        };
        let id = projectId.concat(name);
        let page : Page = {
          id;
          projectId;
          name;
          order = 0;
        };
        pages.add(id, page);
        page;
      };
    };
  };

  public query ({ caller }) func getPages(projectId : Text) : async [Page] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to view pages");
    };
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (not Principal.equal(project.ownerId, caller)) {
          Runtime.trap("Unauthorized: This is not your project");
        };
        let pagesArray = pages.values().toArray().filter(func(p) { p.projectId == projectId });
        pagesArray.sort(Page.compareByOrder);
      };
    };
  };

  public shared ({ caller }) func updatePage(pageId : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to update page");
    };
    switch (pages.get(pageId)) {
      case (null) { Runtime.trap("Page not found") };
      case (?page) {
        switch (projects.get(page.projectId)) {
          case (null) { Runtime.trap("Project not found") };
          case (?project) {
            if (not Principal.equal(project.ownerId, caller)) {
              Runtime.trap("Unauthorized: This is not your project");
            };
            let updatedPage = { page with name };
            pages.add(pageId, updatedPage);
          };
        };
      };
    };
  };

  public shared ({ caller }) func deletePage(pageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to delete page");
    };
    switch (pages.get(pageId)) {
      case (null) { Runtime.trap("Page not found") };
      case (?page) {
        switch (projects.get(page.projectId)) {
          case (null) { Runtime.trap("Project not found") };
          case (?project) {
            if (not Principal.equal(project.ownerId, caller)) {
              Runtime.trap("Unauthorized: This is not your project");
            };
            // Remove associated elements
            let elementsToDelete = elements.values().toArray().filter(func(e) { e.pageId == pageId });
            for (element in elementsToDelete.values()) {
              elements.remove(element.id);
            };
            pages.remove(pageId);
          };
        };
      };
    };
  };

  // Element Methods
  public shared ({ caller }) func createElement(pageId : Text, elementType : Text, propsJson : Text, order : Nat) : async Element {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to create element");
    };
    switch (pages.get(pageId)) {
      case (null) { Runtime.trap("Page not found") };
      case (?page) {
        switch (projects.get(page.projectId)) {
          case (null) { Runtime.trap("Project not found") };
          case (?project) {
            if (not Principal.equal(project.ownerId, caller)) {
              Runtime.trap("Unauthorized: This is not your project");
            };
            let id = pageId.concat(elementType).concat(Time.now().toText());
            let element : Element = {
              id;
              pageId;
              elementType;
              propsJson;
              order;
            };
            elements.add(id, element);
            element;
          };
        };
      };
    };
  };

  public query ({ caller }) func getElements(pageId : Text) : async [Element] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to view elements");
    };
    switch (pages.get(pageId)) {
      case (null) { Runtime.trap("Page not found") };
      case (?page) {
        switch (projects.get(page.projectId)) {
          case (null) { Runtime.trap("Project not found") };
          case (?project) {
            if (not Principal.equal(project.ownerId, caller)) {
              Runtime.trap("Unauthorized: This is not your project");
            };
            let elementsArray = elements.values().toArray().filter(func(e) { e.pageId == pageId });
            elementsArray.sort(Element.compareByOrder);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateElement(elementId : Text, propsJson : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to update element");
    };
    switch (elements.get(elementId)) {
      case (null) { Runtime.trap("Element not found") };
      case (?element) {
        switch (pages.get(element.pageId)) {
          case (null) { Runtime.trap("Page not found") };
          case (?page) {
            switch (projects.get(page.projectId)) {
              case (null) { Runtime.trap("Project not found") };
              case (?project) {
                if (not Principal.equal(project.ownerId, caller)) {
                  Runtime.trap("Unauthorized: This is not your project");
                };
                let updatedElement = { element with propsJson };
                elements.add(elementId, updatedElement);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func reorderElements(pageId : Text, elementIds : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to reorder elements");
    };
    switch (pages.get(pageId)) {
      case (null) { Runtime.trap("Page not found") };
      case (?page) {
        switch (projects.get(page.projectId)) {
          case (null) { Runtime.trap("Project not found") };
          case (?project) {
            if (not Principal.equal(project.ownerId, caller)) {
              Runtime.trap("Unauthorized: This is not your project");
            };
            var i = 0;
            while (i < elementIds.size()) {
              switch (elements.get(elementIds[i])) {
                case (null) { Runtime.trap("Element not found") };
                case (?element) {
                  if (element.pageId != pageId) {
                    Runtime.trap("Element does not belong to this page");
                  };
                  let updatedElement = { element with order = i };
                  elements.add(elementIds[i], updatedElement);
                };
              };
              i += 1;
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteElement(elementId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to delete element");
    };
    switch (elements.get(elementId)) {
      case (null) { Runtime.trap("Element not found") };
      case (?element) {
        switch (pages.get(element.pageId)) {
          case (null) { Runtime.trap("Page not found") };
          case (?page) {
            switch (projects.get(page.projectId)) {
              case (null) { Runtime.trap("Project not found") };
              case (?project) {
                if (not Principal.equal(project.ownerId, caller)) {
                  Runtime.trap("Unauthorized: This is not your project");
                };
                elements.remove(elementId);
              };
            };
          };
        };
      };
    };
  };
};
