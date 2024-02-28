package com.anubhav.ecommerce.config;

import com.anubhav.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration configuration, CorsRegistry cors){
        HttpMethod[] unsupportedActions = {HttpMethod.PUT,HttpMethod.DELETE,HttpMethod.POST};
        HttpMethod[] unsupportedActionsForOrders = {HttpMethod.PUT,HttpMethod.DELETE};

        // disable HTTP Methods for Product
        disableHttpMethods(Product.class, configuration, unsupportedActions);
        // disable HTP Methods for ProductCategory , Country and States
        disableHttpMethods(ProductCategory.class, configuration, unsupportedActions);
        disableHttpMethods(Country.class, configuration, unsupportedActions);
        disableHttpMethods(State.class, configuration, unsupportedActions);
        // disable HTTP Methods for Order
        disableHttpMethods(Order.class,configuration,unsupportedActionsForOrders);
        // call an internal helper method to expose the ids
        exposeIds(configuration);

        cors.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true)
                .maxAge(3600);

    }

    private static void disableHttpMethods(Class theClass,RepositoryRestConfiguration configuration, HttpMethod[] unsupportedActions) {
        configuration.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)));
    }

    private void exposeIds(RepositoryRestConfiguration configuration) {
        // expose entity ids

        // get a list of all entity classes from entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        for(EntityType entityType : entities){
            entityClasses.add(entityType.getJavaType());
        }

        // expose entity ids for the array of entity types

        Class[] domainTypes  = entityClasses.toArray(new Class[0]);
        configuration.exposeIdsFor(domainTypes);

    }
}
